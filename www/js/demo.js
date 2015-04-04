var json_object = grads;
var grads_html = {};
var grads_cap_html = {};

var json_grads_html;
var json_grads_cap_html;

var current_id;
var menu_html;
var essay_html;
var colophon_html;
var folio_html;
var distances_from_top = {};
var distances_array = new Array();

var right_template = _.template(document.getElementById('right_drawer').innerHTML);
var left_template = _.template(document.getElementById('left_drawer').innerHTML);








var snapper = new Snap({
    element: document.getElementById('content'),
    slideIntent: 65,
    resistance: 0.6,
    transitionSpeed: 0.2,
    minDragDistance: 8
});
var std_id;



function convert_to_html(){
    $.each( grads, function( key, value ) {
        var topass = value;
        var html_right_toinsert = right_template(topass);
        grads_html[value.id] = html_right_toinsert;
        var html_left_toinsert = left_template(topass.mainimage);
        grads_cap_html[value.id] = html_left_toinsert;
    }); 
    
}

function get_id(dstnc){
    return distances_from_top[closest_butnotover(dstnc, distances_array)];
}

function set_distance_object()
{
    $( ".hero_img" ).each( function( index, element ){
        
        var distancetotop = Math.ceil($(this).offset().top + $(this).height());
        var distanceID = $(this).attr('id');
        distances_from_top[distancetotop] = distanceID;
        
    });
    
    distances_array = Object.keys(distances_from_top);

}



function closest_butnotover(num, ar){
    //console.log(num);
    var i = 0, current, last;
    if(ar.length){ 
        if(ar[0] > num){
            return ar[0];
        }else{
            for(i;i<ar.length;i++)
            {           
                current = ar[i];
                if(current < num)
                {
                    last = current;
                }else{
                    return last;   
                }
            }
            return last;
        }
    }
    return false;
}

function set_static_html(){
    var temp = _.template(document.getElementById('main_menu').innerHTML);
    menu_html = temp();
    temp = _.template(document.getElementById('essay').innerHTML);
    essay_html = temp();
    temp = _.template(document.getElementById('colophon').innerHTML);
    colophon_html = temp();
    folio_html = document.getElementById( 'norm' ).innerHTML;
}


$( document ).on( "vclick", ".under_cranbrook", function() {
  if($('body').hasClass('under_cranbrook_body')){
  }else{
      $('body').removeClass( "folio_body colophon_body" ).addClass('under_cranbrook_body');
      document.getElementById("norm").innerHTML = essay_html;
      scroll_main()
  };
  snapper.close();
});


$( document ).on( "vclick", ".colophon", function() {
  if($('body').hasClass('colophon_body')){
  }else{
      $('body').removeClass( "under_cranbrook_body folio_body" ).addClass('colophon_body');
      document.getElementById("norm").innerHTML = colophon_html;
      scroll_main();
  }
  snapper.close();
})



$( document ).on( "vclick", ".folio", function() {
  if($('body').hasClass('folio_body')){
  }else{
      $('body').removeClass( "under_cranbrook_body colophon_body" ).addClass('folio_body');
      document.getElementById("norm").innerHTML = folio_html;
      scroll_main()
  };

  snapper.close();

});


function scroll_main(){
  var myDiv = document.getElementById('content');
  myDiv.scrollTop = 0;
};






function left_set(hero_obj){
    var hero_topass = hero_obj.mainimage;
    var html_left_toinsert = left_template(hero_topass);
    replace_html_side(html_left_toinsert ,"snap-drawer-left");
}

function right_set(side_obj){
    var topass = side_obj;
    var html_right_toinsert = right_template(topass);
    replace_html_side(html_right_toinsert ,"snap-drawer-right");
    //plyr.setup({});
};

function main_set(main_obj){
    var hero_topass = main_obj;
    var main_template = _.template(document.getElementById('main_body').innerHTML);
    var html_main_toinsert = main_template(hero_topass);
    $( ".norm" ).append( html_main_toinsert );
};



function replace_html_side(html_element, element_id){
    document.getElementById(element_id).innerHTML = '';
    document.getElementById(element_id).innerHTML = html_element;
};


var addEvent = function addEvent(element, eventName, func) {
	if (element.addEventListener) {
    	return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};

addEvent(document.getElementById('open-left'), 'click', function(){
    document.getElementById('snap-drawer-left').innerHTML = '';
    document.getElementById('snap-drawer-left').innerHTML = menu_html;
    document.getElementById('snap-drawer-right').innerHTML = '';
    document.getElementById('snap-drawer-right').innerHTML = menu_html;
	snapper.open('left');
});
addEvent(document.getElementById('open-right'), 'click', function(){
    document.getElementById('snap-drawer-left').innerHTML = '';
    document.getElementById('snap-drawer-left').innerHTML = menu_html;
    document.getElementById('snap-drawer-right').innerHTML = '';
    document.getElementById('snap-drawer-right').innerHTML = menu_html;
	snapper.open('right');
});

/* Prevent Safari opening links when viewing as a Mobile App */
(function (a, b, c) {
    if(c in b && b[c]) {
        var d, e = a.location,
            f = /^(a|html)$/i;
        a.addEventListener("click", function (a) {
            d = a.target;
            while(!f.test(d.nodeName)) d = d.parentNode;
            "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
        }, !1)
    }
})(document, window.navigator, "standalone");

snapper.on('start', function(){
    if(snapper.state().state === 'closed'){
        if ($('body').hasClass('under_cranbrook_body') || $('body').hasClass('colophon_body')) {
            console.log('has under cranbrook and or colophon');
            document.getElementById('snap-drawer-left').innerHTML = '';
            document.getElementById('snap-drawer-left').innerHTML = menu_html;
            document.getElementById('snap-drawer-right').innerHTML = '';
            document.getElementById('snap-drawer-right').innerHTML = menu_html;

        }else{
            current_id = get_id($('#content').scrollTop()+window.innerHeight);
            replace_html_side(grads_html[current_id] ,"snap-drawer-right");
            replace_html_side(grads_cap_html[current_id] ,"snap-drawer-left"); 
        }
    }else{
    }    
});

snapper.on('end', function(){
    $("img.lazy").each(function() {
        this.src = this.dataset.original;        
    });
});

snapper.on('animated', function(){
    document.getElementById('snap-drawer-left').scrollTop = 0;
    document.getElementById('snap-drawer-right').scrollTop = 0;
});

$(document).ready(function(e){
    
  $( ".ready" ).animate({
    opacity: 0.00,
  }, 600, function() {
    $('.ready').remove();

    snapper.open('left');
    setTimeout(function(){
        snapper.close();
    }, 700);
    setTimeout(function(){
        snapper.open('right');
        setTimeout(function(){
            snapper.close();
        }, 1100);

    }, 900);
  });

    
    
    convert_to_html();
    set_distance_object();
    set_static_html();
});




(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)

