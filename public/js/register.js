/**
 * Created by okamotojunshu on 15/07/23.
 */
$(document).ready(function(){

$('form input#name').val($.cookie('name'));

$('form').submit(function() {
  $.cookie('name', $('form input#name').val(), { expires: 30 });
//    $.cookie('text', $('form input#text').val(), { expires: 30 });
    window.alert('認証コードを作成しました');
    return false;
});
});