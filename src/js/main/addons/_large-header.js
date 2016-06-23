// large header
$('#large-header-checkbox:checkbox').change(() => {
  if ($('#large-header-checkbox:checkbox').prop('checked')) {
    // if rotating header
    if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header rotating-header" type="text/css">
          input[name=uh] ~ a::after {
            height: 420px;
          }
        </style>
      `);
    }

    // if sidebar image
    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header sidebar-image" type="text/css">
          .side {
            top: ${297 + sidebarImg.height + 16}px;
          }
        </style>
      `);
    } else {
      $('iframe').contents().find('head').append(`
        <style class="large-header" type="text/css">
          .side {
            top: 297px;
          }
        </style>
      `);
    }

    $('iframe').contents().find('head').append(`
      <style class="large-header" type="text/css">
        div.content {
          top: 297px;
        }

        #header-bottom-left {
          top: 172px;
        }

        @media (min-width: 1200px) {
          #header-bottom-left {
            top: 245px;
          }
        }

        body::before {
          height: 420px;
        }
      </style>
    `);

  } else {
    // if sidebar image
    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="sidebar-image" type="text/css">
          .side {
            top: ${223 + sidebarImg.height + 16}px;
          }
        </style>
      `);
    }

    $('iframe').contents().find('head .large-header').detach();
  }
});