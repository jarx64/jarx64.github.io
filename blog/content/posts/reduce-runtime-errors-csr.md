---
title: 'Reducing Runtime Errors With NSwag Client Generation'
date: 2026-07-25T11:24:16+06:00
# weight: 1
# aliases: ["/first"]
tags: ["jq", "sed", "sqlite", "bash"]
draft: true
description: "Reducing integration headache with NSwag"
# canonicalURL: "https://canonical.url/to/page"
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
---

Recent push for LLM generated code has been great for creating MVPs and prototypes. But it feels like we are forgetting tools/methods that have been around for
creating robust and maintainable code. If we are given to implement some features we just throw LLM at frontend and backend and LLM generates duplicated DTO/Service classes for both frontend and backend. But this is ok for MVPs and prototypes but not for production code. If some properties in DTO or Url is changed in backend then frontend will break silently and you might get a call at 3 AM that your button is not working. We can avoid this by using NSwag to generate client code for frontend from backend API.

I am mainly focused on .NET backend and Angular frontend but this can be applied to any backend/frontend stack. I will be using .NET 6 and Angular 18 for this example.

How it works is that we will generate openapi specification from backend and then use that openapi specification to generate client code for frontend. This way if any property is changed in backend then frontend will break at compile time and you will know about it before deploying to production.

Example Simple API:
```csharp
public sealed record PersonDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email
);

[ProducesResponseType(typeof(PersonDto), StatusCodes.Status200OK)]
// Other ProducesResponseType attributes can exist too
[HttpGet("person", Name = nameof(GetPerson))]
public async Task<ActionResult<PersonDto>> GetPerson([FromQuery] Guid personId)
{
    var queryResult = SomeService.GetPerson(personId);
    return Ok(queryResult);
}
```
Maybe you are not using raw `Ok()` and using some sort of `ApiResponse` class to wrap your response. It doesn't matter.

Important parts are 