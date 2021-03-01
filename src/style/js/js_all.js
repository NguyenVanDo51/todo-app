$(document).ready(function(){
	$('.ellipsis').click( function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('._app_popover').toggle();
	});
	$('._app_popover').click( function(e) {

		e.stopPropagation(); 

	});
	$('body').click( function() {
		$('._app_popover').hide();
	});
	$('.nav_tabs_setting').click( function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('.popover_setting').toggle();
	});
	$('.popover_setting').click( function(e) {
		e.stopPropagation(); 
	});
	$('body').click( function() {
		$('.popover_setting').hide();
	});
	$('.icon-edit-name').click( function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('._popup_input_edit_container').toggle();
		$('._popup_input_display_container').hide();
	});
	$('._popup_input_edit_container').click( function(e) {
		e.stopPropagation(); 
	});
	$('body').click( function() {
		$('._popup_input_edit_container').hide();
		$('._popup_input_display_container').show();
	});
	$('._popup_profile_radio').click(function(e){
		$('._popup_profile_radio').removeClass('_popup_profile_radio_active');
		$(this).toggleClass('_popup_profile_radio_active');
	});
	$('.info_item').click(function(e){
		$('.info_item').removeClass('info_item_active');
		$(this).toggleClass('info_item_active');
	});
	$('.status_update_logout').click( function() {
		window.location.replace("login.html");
	});
	$('._show_folder').click( function() {
		$('._app_friend_center_header').toggleClass('_show_folder_full');
		$('.info').toggle();
	});
	$('._app_popover_action').click(function(e){
		$('._app_popover_action').removeClass('active');
		$(this).toggleClass('active');
	});
	$('._show_search').click(function(e){
		$('._chat_search_conversation').toggleClass('active');
	});
	$('._chat_search_conversation_close').click(function(e){
		$('._chat_search_conversation').toggleClass('active');
	});

	$(document).mouseup(e => {
		if (!$('._app_popover_action').is(e.target) &&
			$('._app_popover_action').has(e.target).length === 0) {
			$('._app_popover_action').removeClass('active');
		}
	});
});
