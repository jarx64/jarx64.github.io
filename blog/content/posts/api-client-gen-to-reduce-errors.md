---
title: 'Reducing Runtime Errors With Orval Client Generation'
date: 2026-07-25T11:24:16+06:00
tags: ["orval", "typescript", "react", "dotnet", "openapi", "type-safe", "client-generation"]
draft: false
description: "Reducing integration headache with Orval"
cover:
    relative: false
    hidden: true
---

If we are given to implement some features we just throw LLM at frontend and backend and LLM generates duplicated DTO/Service classes for both frontend and backend. But this is ok for MVPs and prototypes but not for production code. If some properties in DTO or Url is changed in backend then frontend will break silently and you might get a call at 3 AM that your button is not working. We can avoid this by using Orval to generate client code for frontend from backend API.

I am mainly focused on .NET backend and React frontend but this can be applied to any backend/frontend stack.

How it works is that we will generate openapi specification from backend and then use that openapi specification to generate client code for frontend. This way if any property is changed in backend then frontend will break at compile time and you will know about it before deploying to production.

Let's say Foo Service contains 2 controllers one for Customers and one for Orders.
CustomersController has 2 endpoints one for getting customers and one for creating customer. Here is the code for CustomersController.
```csharp
// ...
[ApiController]
[Produces("application/json")]
[Route("api/v1/[controller]")]
public sealed class CustomersController(ICustomerService customerService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<Customer>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<Customer>>> GetCustomers([FromQuery] QueryCustomerRequest request)
    {
        var customers = await customerService.GetCustomersAsync(
            customerId: request.CustomerId);
        if (request.CustomerId.HasValue && customers.Count == 0)
        {
            return NotFound();
        }

        return Ok(customers);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Customer), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Customer>> CreateCustomer(CreateCustomerRequest request)
    {
        var customer = await customerService.CreateCustomerAsync(request: request);

        return CreatedAtAction(nameof(GetCustomers), new QueryCustomerRequest(CustomerId: customer.Id), customer);
    }
}
```

the DTOs are like this
```csharp
// ...
public sealed record Customer(Guid Id, string Name, string Email, CustomerStatus Status);

public sealed record QueryCustomerRequest(Guid? CustomerId);

public sealed record CreateCustomerRequest(string Name, string Email);
```

with simple Program.cs like this
```csharp
// ...
const string LocalhostCorsPolicy = "LocalhostCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<ICustomerRepository, JsonCustomerRepository>();
builder.Services.AddSingleton<IOrderRepository, JsonOrderRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(LocalhostCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddSwaggerGen(options =>
{
    options.CustomOperationIds(apiDescription =>
    {
        return apiDescription.ActionDescriptor is ControllerActionDescriptor actionDescriptor
            ? $"{actionDescriptor.ControllerTypeInfo.Name}_{actionDescriptor.MethodInfo.Name}"
            : null;
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "FooService v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors(LocalhostCorsPolicy);
app.MapControllers();
app.Run();
```

note the operation id generation in `AddSwaggerGen` method. This is important because we will use ControllerName_MethodName format to generate client methods. This would make the method generation collisions free.

The swagger would be like below.
<!-- <img src="/images/posts/reduce-runtime-errors-csr/swagger.png" alt="Swagger UI" width="800" /> -->
![Swagger UI](/blog/images/generated-swagger.png)

Now, Let's move to frontend. We will use Orval to generate client code for frontend. First we need to install Orval in our React project.

First step is to add orval dependency to our project.

```bash
npm install orval -D
```

Next we add a custom command in package.json:
```json
// ...
"scripts": {
"generate-api": "orval --config orval.config.ts",
// ...
```

Let's say we want to generate client code in `src/api/generated` folder. So, .env would contain:
```bash
CLIENT_GENERATION_PATH=src/api/generated
```

I like to keep my api configuration like name, swagger url and base url in a separate file called `api-conf.json` so that we can easily add new api clients in future. Here is how api-conf.json would look like:
```json
[
  {
    "name": "foo",
    "swaggerUrl": "http://localhost:5141/swagger/v1/swagger.json",
    "baseUrl": "http://localhost:5141"
  },
  {
    "name": "bar",
    "swaggerUrl": "http://localhost:6141/swagger/v1/swagger.json",
    "baseUrl": "http://localhost:6141"
  }
]
``` 
Here we have 2 api clients foo and bar. We can add more api clients in future by just adding new entry in this file.

in orval.config.ts we will have:
```ts
import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Options } from 'orval';

interface ApiClientConfig {
  name: string;
  swaggerUrl: string;
  baseUrl: string;
}

const clientGenerationPath = process.env.CLIENT_GENERATION_PATH;

if (!clientGenerationPath) {
  throw new Error('CLIENT_GENERATION_PATH is not defined in the .env file.');
}

const configPath = resolve(process.cwd(), 'api-conf.json');

const apiClients = JSON.parse(readFileSync(configPath, 'utf-8')) as ApiClientConfig[];

const projects = apiClients.reduce<Record<string, Options>>((result, api) => {
  if (!api.name || !api.swaggerUrl || !api.baseUrl) {
    throw new Error(`Invalid API client configuration: ${JSON.stringify(api)}`);
  }

  result[api.name] = {
    output: {
      mode: 'tags-split',
      target: resolve(clientGenerationPath, api.name, 'client.ts'),
      schemas: resolve(clientGenerationPath, api.name, 'models'),
      httpClient: 'axios',
      baseUrl: api.baseUrl,
      mock: false,
      override: {
        mutator: {
          path: './src/api/axiosProvider.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: api.swaggerUrl,
    },
  };

  return result;
}, {});

export default defineConfig(projects);
```
The good thing about this configuration is that we can add new api clients in future by just adding new entry in api-conf.json and we don't need to change orval.config.ts file.

But for auth we need to create a custom axios instance in `src/api/axiosProvider.ts` file. Here is how it would look like:
```ts
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({});

// Request interceptor for auth
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
```

This custom axios instance will add the auth token to the request headers and also handle 401 errors by redirecting to login page (we don't have that here though.)

now by running `npm run generate-api` we will have client code generated in following directories
![Generated Client Code](/blog/images/generated-client.png)

now we can create thin services that uses generated client code to call backend apis. Here is how CustomerService would look like:
```ts
import {
  customersControllerCreateCustomer,
  customersControllerGetCustomers,
} from 'src/api/generated/foo/customers/customers';
import { Customer } from 'src/api/generated/foo/models';

export const getCustomers = (customerId: string | undefined): Promise<Customer[]> => {
  return customersControllerGetCustomers({
    CustomerId: customerId || undefined,
  });
};

export const createCustomer = (customer: Customer): Promise<Customer> => {
  return customersControllerCreateCustomer(customer);
};
```

we can further use this service in hooks to call backend apis.

This allows us to generate compile time safe client code for frontend from backend apis. If any property is changed in backend then frontend will break at compile time and we will know about it before deploying to production. This will reduce runtime errors and integration headache.


Full repository: [https://github.com/jarx64/dotnet-ts-client-generation](https://github.com/jarx64/dotnet-ts-client-generation)