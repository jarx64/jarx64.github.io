import{deleteInputTable,recalculateInputTable,recalculateStoredTables,removeLastInputTableRow}from"/app-res/input_table_operations.js";const inputTableHeads=["খতিয়ানের ধরন","খতিয়ান নম্বর","অত্র খতিয়ানে আবেদন","দাগ নম্বর","খতিয়ানে দাগে জমি (একর)","জমির মাপক ও জমির পরিমাণ (একর)","দলিল নং","রেজিঃ তাং","রেজিঃ অফিস"],ownerTableHeads=["খতিয়ান নং","খতিয়ানে আবেদন","নাম ও হোল্ডিং নং","পিতা/স্বামী, ঠিকানা","জমির পরিমান","তফসিল সম্পর্কিত নোট"],inputTableRowOperationButtons='<button style="margin-right: 5px" id="add-new-input-table-row-btn" class="btn btn-success lowres-btn"><i class="fas fa-plus"></i></button><button data-bs-target="#remove-last-input-table-row-modal" data-bs-toggle="modal" id="remove-this-input-table-row-btn" class="btn btn-danger"><i class="fas fa-minus lowres-btn"></i></button>',ownerTableRowOperationButtons='<button style="margin-right: 5px" id="add-new-owner-table-row-btn" class="btn btn-success lowres-btn" ><i class="fas fa-plus"></i></button><button id="remove-this-owner-table-row-btn" class="btn btn-danger"><i class="fas fa-minus lowres-btn"></i></button>';let colorCount=Math.floor(10*Math.random());const getNewColor=()=>`hsl(${40*colorCount++%360}, 100%, 65%)`;let fractionDigits=5;const getFractionDigits=()=>fractionDigits;let currentMatchedColor=getNewColor();const getCurrentMatchedColor=()=>currentMatchedColor,setCurrentMatchedColor=e=>currentMatchedColor=e,changeFractions=()=>{var e=document.querySelector("#table-fraction").checked;fractionDigits=e?5:4,null!==document.querySelector("#records-input-table")&&recalculateInputTable(),0<document.querySelectorAll("#tables-container table").length&&recalculateStoredTables()};let ledgers={};const getLedgers=()=>ledgers,populateLedgerMap=()=>{ledgers={};var a=document.querySelectorAll("#tables-container table");if(0<a.length)for(let t=0;t<a.length;t++){var e=a[t].rows[1].cells[1].childNodes[0].textContent,n=a[t].rows[1].cells[0].childNodes[2].textContent+" | "+e;void 0===ledgers[n]&&(ledgers[n]={},ledgers[n].lands=[]),ledgers[n].tableIdx=t;for(let e=2;e<a[t].rows.length-1;e++)ledgers[n].lands.push({landId:a[t].rows[e].cells[0].childNodes[0].textContent,row:e})}},disableNewInputTableCreation=()=>{document.querySelector("#records-count-text").disabled=!0;var e=document.querySelector("#create-table-btn");e.disabled=!0,e.classList.remove("btn-primary"),e.classList.add("btn-secondary")},disableNewOwnerInfoTableCreation=()=>{document.querySelector("#create-owner-info-table-btn").disabled=!0,document.querySelector("#create-owner-info-table-btn").classList.remove("btn-primary"),document.querySelector("#create-owner-info-table-btn").classList.add("btn-secondary")},confirmModalMaker=(e,t,a,n,r)=>{var o=document.createElement("div");o.innerHTML=`
<div aria-hidden="true" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="${e}" tabindex="-1">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h1 class="modal-title fs-5">${t}</h1>
                  <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
              </div>
              <div class="modal-body">
                  ${a}
              </div>
              <div class="modal-footer">
              <button class="btn btn-primary" data-bs-dismiss="modal" type="button">হ্যা</button>
              <button class="btn btn-danger" data-bs-dismiss="modal" type="button">না</button>
              </div>
          </div>
      </div>
  </div>`,document.querySelector("body").appendChild(o),o.querySelector(".btn-primary").addEventListener("click",n),o.querySelector(".btn-danger").addEventListener("click",r)},warnModalMaker=(e,t,a,n)=>{var r=document.createElement("div");r.id=e,r.innerHTML=`
<div aria-hidden="true" aria-labelledby="staticBackdropLabel" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
      id="staticBackdrop" tabindex="-1">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h1 class="modal-title fs-5" id="staticBackdropLabel">${t}</h1>
                  <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
              </div>
              <div class="modal-body">
                  ${a}
              </div>
              <div class="modal-footer">
              <button class="btn btn-primary" data-bs-dismiss="modal" type="button">হ্যা</button>
              </div>
          </div>
      </div>
  </div>
`,document.querySelector("body").appendChild(r),r.querySelector(".btn-primary").addEventListener("click",n)},heading=(confirmModalMaker("cancel-input-table-modal","ই-নামজারি","আপনি কি সত্যিই এই টেবিলটি মুছে ফেলতে চান?",()=>deleteInputTable(),()=>{}),confirmModalMaker("remove-last-input-table-row-modal","ই-নামজারি","আপনি কি সত্যিই এই সারি মুছে ফেলতে চান?",()=>{removeLastInputTableRow()},()=>{}),'<div class="text-center"><span id="main-heading" class="display-6">ই-নামজারি</span></div><br />'),dayInput=(document.querySelector("#main-content").innerHTML=heading+document.querySelector("#main-content").innerHTML,document.querySelector("#main-content").innerHTML+='<button id="print-btn" class="print-button btn btn-info"><i class="fas fa-print"></i> Print</button>',document.querySelector("#main-content").innerHTML+='<button id="reload-btn" class="reload-button btn btn-danger"><i class="fas fa-redo-alt"></i> Reload</button>',document.querySelector("#reload-btn").addEventListener("click",()=>{window.location.reload()}),document.querySelector("#print-btn").addEventListener("click",()=>{SetExtraParams(),window.print()}),e=>{2===e.target.value.length&&e.target.parentElement.parentElement.querySelector(".month-input").focus()}),monthInput=e=>{2===e.target.value.length&&e.target.parentElement.parentElement.querySelector(".year-input").focus()},yearInput=e=>{4===e.target.value.length&&e.target.parentElement.parentElement.parentElement.cells[5].childNodes[0].focus()},handleArrowKeyEvent=e=>{"ArrowDown"===e.key&&(console.log(e.key),console.log(e.target)),"ArrowUp"===e.key&&(e.preventDefault(),e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".year-input").focus())},SetExtraParams=(document.querySelector("#fractions-digit-control-container input").checked=!0,()=>{document.querySelector("#extra-info-container").style.display="block";var e=document.querySelector("#owner-type-container").querySelectorAll(".form-check-input");const t=[];e.forEach(e=>{e.checked&&t.push(e.value)});e=document.querySelector("#owner-type-container").querySelector("#owner-type-other-text").value;""!==e&&t.push(e),document.querySelector("#owner-type-text-print").innerHTML=t.join(", "),document.querySelector("#mouja-text-print").innerHTML=document.querySelector("#area-id-text").value,document.querySelector("#j-l-number-text-print").innerHTML=document.querySelector("#j-l-number-text").value});document.querySelector("head").innerHTML+=`       
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FZ8Y5SRHKG"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-FZ8Y5SRHKG');
    </script>
    `;export{inputTableHeads,ownerTableHeads,inputTableRowOperationButtons,ownerTableRowOperationButtons,getNewColor,getFractionDigits,getCurrentMatchedColor,setCurrentMatchedColor,changeFractions,getLedgers,populateLedgerMap,disableNewInputTableCreation,disableNewOwnerInfoTableCreation,confirmModalMaker,warnModalMaker,dayInput,monthInput,yearInput,handleArrowKeyEvent,SetExtraParams};