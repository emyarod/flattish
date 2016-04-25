(function(Sass) {
  'use strict';

  // make sure the namespace is available
  !Sass.maps && (Sass.maps = {});

  // files map for bourbon v4.2.1 - http://bourbon.io/
  Sass.maps.flattish = {
    // make the source file available in "bourbon/_bourbon.scss"
    directory: 'flattish',
    // https://github.com/thoughtbot/bourbon/blob/v4.2.1/app/assets/stylesheets/
    // using rawgit to directly access the github repository via CORS
    // NOTE: that this will only work for preloading, as lazyloading throws security exceptions
    base: '../style',
    files: [
      'utils/_color-list.scss',
      'utils/_vars.scss',
      'utils/_mixins.scss',
      'utils/_functions.scss',
      'utils/_addons.scss',
      'components/_buttons.scss',
      'components/_cards.scss',
      'components/_dropdowns.scss',
      'components/_expandos.scss',
      'components/_menus.scss',
      'components/_res.scss',
      'components/_ripple.scss',
      'components/_spritesheet.scss',
      'components/_tables.scss',
      'components/_tabs.scss',
      'components/_text-fields.scss',
      'components/_thumbnails.scss',
      'components/_toggles.scss',
      'components/_tooltips.scss',
      'components/_typography.scss',
      'components/_vote-arrows.scss',
      'modules/content/_sitetable.scss',
      'modules/_content.scss',
      'modules/header/_header-bottom-left.scss',
      'modules/header/_header-bottom-right.scss',
      'modules/header/_sr-bar.scss',
      'modules/_header.scss',
      'modules/sidebar/_login.scss',
      'modules/sidebar/_search.scss',
      'modules/sidebar/_sidecontentbox.scss',
      'modules/sidebar/_submit.scss',
      'modules/sidebar/_titlebox.scss',
      'modules/_sidebar.scss',
      'modules/_footer.scss',
      'modules/_base.scss',
      'pages/_comments-page.scss',
      'pages/_compose-page.scss',
      'pages/_flair-page.scss',
      'pages/_search-page.scss',
      'pages/_settings-page.scss',
      'pages/_stylesheet-page.scss',
      'pages/_submit-page.scss',
      'pages/_top-page.scss',
      'pages/_wiki-page.scss',
      'flattish.scss'
    ]
  };

})(Sass);