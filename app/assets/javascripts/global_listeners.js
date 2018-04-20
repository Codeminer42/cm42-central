/* eslint func-names:"off" */
/* eslint no-use-before-define:"off" */
/* eslint no-unused-vars:"off" */
/* eslint consistent-return:"off" */
/* eslint no-fallthrough:"off" */
const executeAttachinary = require('libs/execute_attachinary');
const KeycutView = require('views/keycut_view');

const $navbar = $('.navbar');
const $navbarToggle = $('.toggle-navbar.more');
const $sidebarToggleIcon = $('#sidebar-toggle').children('.mi');
const $sidebarWrapper = $('#sidebar-wrapper');

$(() => {
  $('[data-toggle="tooltip"]').tooltip();

  $('#story-flow-toggle').click(function () {
    window.projectView.model.toggleStoryFlow();
    $(this).toggleClass('pressed');
  });

  $('.toggle-navbar').click((e) => {
    e.preventDefault();

    if ($navbar.is(':hidden')) {
      showNavbar();
    } else {
      hideNavbar();
    }
  });

  $('#add_story').click(() => {
    window.projectView.newStory();

    // Show chilly bin if it's hidden
    $('.hide_chilly_bin.pressed').click();
    const newStoryElement = $('#chilly_bin div.story:last');
  });

  // keycut listener
  $('html').keypress((event) => {
    const code = event.which || event.keyCode;
    const keyChar = String.fromCharCode(code);
    switch (code) {
      case 63: // ? | Should only work without a focused element
        if (!$(':focus').length) {
          if ($('#keycut-help').length) {
            $('#keycut-help').fadeOut(() => {
              $('#keycut-help').remove();
            });
          } else {
            new KeycutView().render();
          }
        }
        break;
      case 66: // B | Should only work without a focused element
        if (!$(':focus').length) {
          $('a.hide_backlog').first().click();
        }
        break;
      case 67: // C | Should only work without a focused element
        if (!$(':focus').length) {
          $('a.hide_chilly_bin').first().click();
        }
        break;
      case 68: // D | Should only work without a focused element
        if (!$(':focus').length) {
          $('a.hide_done').first().click();
        }
        break;
      case 80: // P | Should only work without a focused element
        if (!$(':focus').length) {
          $('a.hide_in_progress').first().click();
        }
        break;

      case 97: // a | Should only work without a focused element
        if (!$(':focus').length && window.projectView) {
          window.projectView.newStory();
          $('.hide_chilly_bin.pressed').first().click();
          const newStoryElement = $('#chilly_bin div.story:last');
          return false;
        }
        break;
      case 19: // <cmd> + s
        $('.story.editing').find('.submit').click();
      default:
          // whatever
    }
  });

  $sidebarWrapper.mouseenter(() => {
    $sidebarWrapper.toggleClass('open');
  });

  $sidebarWrapper.mouseleave(() => {
    $sidebarWrapper.removeClass('open');
  });

  $('#sidebar-toggle').click((e) => {
    e.preventDefault();

    if ($sidebarWrapper.hasClass('collapsed')) { $sidebarToggleIcon.text('close'); } else { $sidebarToggleIcon.text('menu'); }

    $sidebarWrapper.toggleClass('collapsed');
  });

  $('.tag-tooltip').tooltip();

  $('.locale-change-select').on('change', function (e) {
    e.preventDefault();

    $(this).parent().parent('form').submit();
  });

  if ($('.change-team')) {
    if (_.isUndefined($('#user_team_slug').attr('readonly'))) {
      $('.change-team').css('display', 'none');
    } else {
      $('.change-team').on('click', () => {
        $('#user_team_slug').attr('readonly', false);
        $('#user_team_slug').val('');
        $('#user_team_slug').focus();
        $('.change-team').css('display', 'none');
      });
    }
  }

  executeAttachinary();
});

function showNavbar() {
  $navbar.show();
  $navbarToggle.hide();
}

function hideNavbar() {
  $navbar.hide();
  $navbarToggle.show();
}
