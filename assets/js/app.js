let app = new Vue({
  el: '#main_section',
  data:() => ({
    json: $.getJSON('data.json',function(data){app.json = data;})
  }),
  mounted() {
    let customScript = document.createElement('script');
    customScript.setAttribute('src', 'assets/js/custom.js');
    document.head.appendChild(customScript);
  },
});
let bottom_app = new Vue({
  el: "#bottom_section",
  data:()=>({
    json: $.getJSON('data.json',function(data){bottom_app.json = data;})
  })
});
let footer = new Vue({
  el: "#footer",
  data:()=>({
    year: new Date().getFullYear()
  })
});