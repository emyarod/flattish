export var sidebarImg = {
  height: 224,
  URL: '',
  reset: () => {
    sidebarImg.height = 224;
    sidebarImg.URL = sidebarImg.URLreset;
  }
};

export function sidebarImageLivePreview(image) {
  if (image !== undefined) {
    if (image.search(/data:image\/png;base64,/) !== -1) {
      sidebarImg.URL = image;
    }
  }

  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="sidebar-image large-header" type="text/css">
          .side {
            top: ${297 + sidebarImg.height + 16}px;
          }
        </style>
      `);
    } else {
      $('iframe').contents().find('head').append(
        `
        <style class="sidebar-image" type="text/css">
          .side {
            top: ${223 + sidebarImg.height + 16}px;
          }
        </style>
        `
      );
    }

    $('iframe').contents().find('head').append(`
      <style class="sidebar-image" type="text/css">
        .titlebox::before {
          position: absolute;
          top: ${-sidebarImg.height - 16}px;
          right: -330px;
          display: block;
          height: ${sidebarImg.height}px;
          width: 330px;
          content: '';
          border-radius: 2px;
          background: url(${sidebarImg.URL}) center;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        }

        @media (max-resolution: 1dppx) and (min-width: 992px) {
          .titlebox::before {
            right: 0;
          }
        }
      </style>
    `);
  } else {
    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header" type="text/css">
          .side {
            top: 297px;
          }
        </style>
      `);
    }

    $('iframe').contents().find('head .sidebar-image').detach();
  }
}
