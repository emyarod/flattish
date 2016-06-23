import { compileButtonEnabler } from './_compile-button-enabler.js';
export var stickies = {
  URL: '',
  album: '0 -10px',
  notice: '-120px -10px',
  calendar: '-60px -70px',
  help: '0 -130px',
  info: '-120px -130px',
  media: '-180px -70px',
  shows: '0 -190px',
};

export var topicSettings = {
  counter: 0,
  reset: () => {
    // delete all keys except counter and reset function
    for (var key in topicSettings) {
      if (topicSettings.hasOwnProperty(key)) {
        if (key !== 'counter' && key !== 'reset') {
          delete topicSettings[key];
        }
      }
    }

    // reset counter
    topicSettings.counter = 0;
  },
};

// pinned topics validation
function pinnedTopicsValidation(status) {
  if (status === 'disable') {
    // remove warning labels
    $('a[href="#pinned-topics-panel"] .label-warning').detach();

    // disable compile button
    compileButtonEnabler('disable');

    // add warning label
    $('a[href="#pinned-topics-panel"]')
      .prepend(`<span class="label label-warning">Error</span>`);
  } else if (status === 'enable') {
    // enable compile button
    compileButtonEnabler('enable');

    // remove warning labels
    $('a[href="#pinned-topics-panel"] .label-warning').detach();
  }
}

// check if required fields are filled
function pinnedTopicsTestRequiredFields() {
  let test = true;
  $('#pinned-topics-panel input:required').each((index, value) => {
    // for URL inputs, validate URLs
    if ($(value).attr('type') === 'url') {
      if (!re_weburl.test($(value).val())) {
        test = false;
      }
    } else if (!$(value).val()) {
      // fail test if required fields are empty
      test = false;
    }
  });

  if (test) {
    // clear warning labels and enable compile button
    pinnedTopicsValidation('enable');
  } else {
    // disable compile button until required forms are filled
    pinnedTopicsValidation('disable');
  }
}

// add pinned topic and event listeners for each topic
function addTopic() {
  /**
   * LIVE PREVIEW FUNCTIONS
   *   `topicSettings.counter` refers to the latest topic that has been added
   *   `currentTopic` refers to the topic being modified at the current time
   * 1. pinned links
   * 2. pinned menus
   * 3. URL input fields
   */

  // 1. live preview for pinned links
  function pinnedLinksLivePreview(topicNum) {
    if (topicNum === topicSettings.counter) {
      $(`#topic${topicNum}-text`).keyup((event) => {
        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent('.input-group').addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(`#topic${topicNum} a`)
            .text('reddit: the front page of the internet');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent('.input-group').removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(`#topic${topicNum} a`)
            .text($(event.currentTarget).val());
        }
      });
    } else {
      // topicNum === currentTopic
      $(`#${topicNum}-text`).keyup((event) => {
        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent('.input-group').addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(`#${topicNum} a`)
            .text('reddit: the front page of the internet');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent('.input-group')
            .removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(`#${topicNum} a`)
            .text($(event.currentTarget).val());
        }
      });
    }
  }

  // 2. live preview for pinned menus
  function pinnedMenulinksLivePreview(topicNum) {
    if (topicNum === topicSettings.counter) {
      // menu titles
      $(`#topic${topicNum}-menutitle`).keyup((event) => {
        $('iframe').contents().find(`#topic${topicNum}-menutitle`)
          .text($(event.currentTarget).val());
      });

      // menulink text
      $(`.topic${topicNum}-menulink-text`).keyup((event) => {
        // manipulate from `topic1-menulink1-text` to `topic1-menulink-1`
        let id = $(event.currentTarget).attr('id');
        id = `#${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;

        $('iframe').contents().find(id).text($(event.currentTarget).val());
      });
    } else {
      // topicNum === currentTopic
      // menu titles
      $(`#${topicNum}-menutitle`).keyup((event) => {
        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent() .closest('.form-group')
            .addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(`#${topicNum}-menutitle`)
            .text('Menu title');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent().closest('.form-group')
            .removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(`#${topicNum}-menutitle`)
            .text($(event.currentTarget).val());
        }
      });

      // menulink text
      $(`.${topicNum}-menulink-text`).keyup((event) => {
        // manipulate from `topic1-menulink1-text` to `topic1-menulink-1`
        let id = $(event.currentTarget).attr('id');
        id = `#${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;

        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent('.input-group').addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(id)
            .text('reddit: the front page of the internet');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent('.input-group')
            .removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(id).text($(event.currentTarget).val());
        }
      });
    }
  }

  // 3. URL keyup listener
  function URLkeyupListener() {
    $('#pinned-topics-panel input[type="url"]').keyup((event) => {
      if (!$(event.currentTarget).val() || !re_weburl.test($(event.currentTarget).val())) {
        // add error class to input group
        $(event.currentTarget).parent().addClass('has-error')

        // remove duplicate error messages
        $(event.currentTarget).parent().siblings('.text-danger').detach();

        // add error message
        $(event.currentTarget).parent().after('<p class="text-danger">Invalid URL!</p>');
      } else {
        // remove error class from input group
        $(event.currentTarget).parent().removeClass('has-error');

        // remove error messages
        $(event.currentTarget).parent().siblings('.text-danger').detach();
      }
    });
  }

  let bezierEasing = [0.4, 0, 0.2, 1];

  // increment counter
  topicSettings.counter++;

  // enable remove topic button if more than 1 topic
  if (topicSettings.counter > 1) {
    $('#remove-topic').prop('disabled', false);
  }

  /**
   * DEFAULT MARKUP
   */
  $('#pinned-topics-config').append(`
    <div class="pinned-topic col-md-12" id="topic${topicSettings.counter}">
      <h4>Topic ${topicSettings.counter}</h4>
      <div class="col-md-12 topic-image">
        <h5>Background image</h5>
        <div class="btn-group btn-group-justified" role="group" data-toggle="buttons">
          <label class="btn btn-default active">
            <input type="radio" name="options" autocomplete="off" checked> Album
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Notice
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Calendar
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Help
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Info
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Media
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Shows
          </label>
        </div>
      </div>
      <div class="col-md-12 topic-type">
        <h5>Type</h5>
        <div class="btn-group btn-group-justified" data-toggle="buttons">
          <label class="btn btn-default active">
            <input type="radio" name="options" autocomplete="off" checked>Link
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off">Menu
          </label>
        </div>
        <div id="topic${topicSettings.counter}-link-container">
          <div class="form-horizontal">
            <div class="form-group">
              <label for="topic${topicSettings.counter}-text" class="col-md-2 control-label">Hyperlink</label>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">[</div>
                  <input type="text" class="form-control" id="topic${topicSettings.counter}-text" placeholder="reddit: the front page of the internet" required>
                  <div class="input-group-addon">]</div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">(</div>
                  <input type="url" class="form-control" id="topic${topicSettings.counter}-link" placeholder="https://www.reddit.com/" required>
                  <div class="input-group-addon">)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="topic${topicSettings.counter}-menu-container" style="display:none">
          <div class="menulinks">
          <div class="form-horizontal">
            <div class="form-group has-error">
              <label for="topic${topicSettings.counter}-menutitle" class="col-md-2 control-label">Menu Title</label>
              <div class="col-md-10">
                <input type="text" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menutitle" id="topic${topicSettings.counter}-menutitle" placeholder="Menu title" disabled>
              </div>
            </div>
            <div class="form-group">
              <label for="topic${topicSettings.counter}-menulink1-text" class="col-md-2 control-label">Hyperlink 1</label>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">[</div>
                  <input type="text" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-text" id="topic${topicSettings.counter}-menulink1-text" placeholder="reddit: the front page of the internet" disabled>
                  <div class="input-group-addon">]</div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">(</div>
                  <input type="url" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-link" id="topic${topicSettings.counter}-menulink1-link" placeholder="https://www.reddit.com/" disabled>
                  <div class="input-group-addon">)</div>
                </div>
              </div>
            </div>
          </div>
            <div class="form-horizontal">
              <div class="form-group">
                <label for="topic${topicSettings.counter}-menulink2-text" class="col-md-2 control-label">Hyperlink 2</label>
                <div class="col-md-5">
                  <div class="input-group has-error">
                    <div class="input-group-addon">[</div>
                    <input type="text" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-text" id="topic${topicSettings.counter}-menulink2-text" placeholder="reddit: the front page of the internet" disabled>
                    <div class="input-group-addon">]</div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="input-group has-error">
                    <div class="input-group-addon">(</div>
                    <input type="url" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-link" id="topic${topicSettings.counter}-menulink2-link" placeholder="https://www.reddit.com/" disabled>
                    <div class="input-group-addon">)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-group" id="topic${topicSettings.counter}-menulinks-control" aria-label="topic${topicSettings.counter}-menulinks-control">
            <button type="button" class="btn btn-primary add-menulink" disabled>+</button>
            <button type="button" class="btn btn-primary remove-menulink" disabled>-</button>
          </div>
        </div>
      </div>
    </div>
  `);

  // default live preview contents
  $('iframe').contents().find('blockquote.pinned-topics').append(`
    <p id="topic${topicSettings.counter}">
      <a href="https://reddit.com" onclick="return false">reddit: the front page of the internet</a>
    </p>
  `);

  // add new key and values to topicSettings
  topicSettings[`topic${topicSettings.counter}`] = {
    type: $(`#topic${topicSettings.counter} .topic-type .active`)
      .text()
      .trim()
      .toLowerCase(),
    image: $(`#topic${topicSettings.counter} .topic-image .active`)
      .text()
      .trim()
      .toLowerCase(),
    menulinks: 2,
  };

  /**
   * EVENT LISTENERS
   */

  // unbind old listener
  $(`#topic${topicSettings.counter}`).unbind();

  // for each topic, add event listener
  $(`#topic${topicSettings.counter}`).change((event) => {
    let currentTopic = $(event.currentTarget).attr('id');
    let topicType = $(`#${currentTopic} .topic-type .active`)
      .text()
      .trim()
      .toLowerCase();
    let topicImage = $(`#${currentTopic} .topic-image .active`)
      .text()
      .trim()
      .toLowerCase();

    topicSettings[currentTopic].type = topicType;
    topicSettings[currentTopic].image = topicImage;

    /**
     * TOPIC TYPE LISTENERS
     * 1. LINK option is chosen
     * 2. MENU option is chosen
     */
    if (topicType === 'link') {
      /**
       * 1. IF LINK IS CHOSEN
       */

      // hide, disable, and unrequire pinned menu inputs
      $(`#${currentTopic}-menu-container`).hide();
      $(`.${currentTopic}-menulink, #${currentTopic}-menulinks-control .add-menulink`)
        .prop({
          'disabled': true,
          'required': false,
        });

      // enable, require, and show pinned link input
      $(`#${currentTopic}-text, #${currentTopic}-link`).prop({
        'disabled': false,
        'required': true,
      });

      $(`#${currentTopic}-link-container`).fadeIn(200, $.bez(bezierEasing));

      // live preview
      if (!$(`#${currentTopic}-text`).val()) {
        $('iframe').contents().find(`#${currentTopic}`).replaceWith(`
          <p id="${currentTopic}">
            <a href="https://reddit.com" onclick="return false">reddit: the front page of the internet</a>
          </p>
        `);
      } else {
        $('iframe').contents().find(`#${currentTopic}`).replaceWith(`
          <p id="${currentTopic}">
            <a href="${$(`#${currentTopic}-link`).val()}">${$(`#${currentTopic}-text`).val()}</a>
          </p>
        `);
      }

      // test required fields on topic type change
      pinnedTopicsTestRequiredFields();

      // unbind old listeners
      $(`#pinned-topics-panel input:required`).unbind();

      // live preview for pinned links
      pinnedLinksLivePreview(currentTopic);

      // URL keyup listener
      URLkeyupListener();

      // validation for required input forms
      $('#pinned-topics-panel input:required').keyup((event) => {
        pinnedTopicsTestRequiredFields();
      });
    } else if (topicType === 'menu') {
      /**
       * 2. IF MENU IS CHOSEN
       */

      // hide, disable, and unrequire pinned link input
      $(`#${currentTopic}-link-container`).hide();
      $(`#${currentTopic}-text, #${currentTopic}-link`).prop({
        'disabled': true,
        'required': false,
      });

      // enable, require, and show pinned menu inputs
      $(`.${currentTopic}-menulink, #${currentTopic}-menulinks-control .add-menulink`)
        .prop({
          'disabled': false,
          'required': true,
        });

      $(`#${currentTopic}-menu-container`).fadeIn(200, $.bez(bezierEasing));

      // live preview menulink text
      let menuLinksContent = {};
      $(`.${currentTopic}-menulink-text`).each((index, value) => {
        // manipulate from `topic1-menulink1-text` to `topic1-menulink-1`
        let id = value.id;
        id = `${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;
        menuLinksContent[id] = {};

        // assign key-value pair
        if (!$(`#${value.id}`).val()) {
          menuLinksContent[id].text = 'reddit: the front page of the internet';
        } else {
          menuLinksContent[id].text = $(`#${value.id}`).val();
        }
      });

      // live preview menulink links
      $(`.${currentTopic}-menulink-link`).each((index, value) => {
        // manipulate from `topic1-menulink1-link` to `topic1-menulink-1`
        let id = value.id;
        id = `${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;

        // assign key-value pair
        if (!$(`#${value.id}`).val()) {
          menuLinksContent[id].link = 'https://reddit.com/';
        } else {
          menuLinksContent[id].link = $(`#${value.id}`).val();
        }
      });

      // insert markup
      let replacementTitle = $(`#${currentTopic}-menutitle`).val();
      if (!$(`#${currentTopic}-menutitle`).val()) {
        replacementTitle = 'Menu Title';
      }

      let replacementMarkup = '';
      for (var key in menuLinksContent) {
        if (menuLinksContent.hasOwnProperty(key)) {
          replacementMarkup = `${replacementMarkup}
          <li>
            <a id="${key}" href="${menuLinksContent[key].link}" onclick="return false">${menuLinksContent[key].text}</a>
          </li>`;
        }
      }

      $('iframe').contents().find(`#${currentTopic}`).replaceWith(`
        <ul id="${currentTopic}">
          <li id=${currentTopic}-menutitle>${replacementTitle}</li>
          ${replacementMarkup}
        </ul>
      `);

      // test required fields on topic type change
      pinnedTopicsTestRequiredFields();

      // unbind old listeners
      $(`#pinned-topics-panel input:required`).unbind();

      // live preview for pinned menus
      pinnedMenulinksLivePreview(currentTopic);

      // URL keyup listener
      URLkeyupListener();

      // validation for required input forms
      $('#pinned-topics-panel input:required').keyup((event) => {
        pinnedTopicsTestRequiredFields();
      });
    }

    /**
     * MENULINK CONTROLS
     *
     * control # of menulinks per pinned menu
     */

    // unbind old listener
    $(`#${currentTopic} .add-menulink,
      #${currentTopic} .remove-menulink`).unbind();

    // add menulink
    $(`#${currentTopic} .add-menulink`).click(() => {
      // increment number of menulinks for this particular topic
      topicSettings[currentTopic].menulinks++;

      // enable remove menulink button if more than 2 menulinks are present
      if (topicSettings[currentTopic].menulinks > 2) {
        $(`#${currentTopic}-menulinks-control .remove-menulink`)
        .prop('disabled', false);
      }

      // append markup
      $(`#${currentTopic}-menu-container .menulinks`).append(`
        <div class="form-horizontal">
          <div class="form-group">
            <label for="${currentTopic}-menulink${topicSettings[currentTopic].menulinks}-text" class="col-md-2 control-label">Hyperlink ${topicSettings[currentTopic].menulinks}</label>
            <div class="col-md-5">
              <div class="input-group has-error">
                <div class="input-group-addon">[</div>
                <input type="text" class="form-control ${currentTopic}-menulink ${currentTopic}-menulink-text" id="${currentTopic}-menulink${topicSettings[currentTopic].menulinks}-text" placeholder="reddit: the front page of the internet" required>
                <div class="input-group-addon">]</div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="input-group has-error">
                <div class="input-group-addon">(</div>
                <input type="url" class="form-control ${currentTopic}-menulink ${currentTopic}-menulink-link" id="${currentTopic}-menulink${topicSettings[currentTopic].menulinks}-link" placeholder="https://www.reddit.com/" required>
                <div class="input-group-addon">)</div>
              </div>
            </div>
          </div>
        </div>
      `);

      // validation for required input forms
      pinnedTopicsTestRequiredFields();

      // unbind old listeners
      $(`#pinned-topics-panel input:required`).unbind();

      // live preview for pinned menus
      pinnedMenulinksLivePreview(currentTopic);

      // URL keyup listener
      URLkeyupListener();

      // live preview
      $('iframe').contents().find(`#${currentTopic} ul`).append(`
        <li>
          <a id="${currentTopic}-menulink-${topicSettings[currentTopic].menulinks}" href="https://reddit.com" onclick"return false"=>reddit: the front page of the internet</a>
        </li>
      `);
    });

    // remove menulink
    $(`#${currentTopic} .remove-menulink`).click(() => {
      // decrement number of menulinks for this particular topic (if amount > 2)
      if (topicSettings[currentTopic].menulinks > 2) {
        topicSettings[currentTopic].menulinks--;
      }

      // disable remove menulink button if only 2 menulinks remain
      if (topicSettings[currentTopic].menulinks === 2) {
        $(`#${currentTopic}-menulinks-control .remove-menulink`)
        .prop('disabled', true);
      }

      // remove last menulink input form
      $(`#${currentTopic}-menu-container .form-horizontal`).last().remove();

      // validation for required input forms
      pinnedTopicsTestRequiredFields();

      // live preview
      $('iframe').contents().find(`#${currentTopic} ul li`).last().remove();
    });

    /**
     * TOPIC IMAGE LISTENERS
     */
    switch (true) {
      case topicImage === 'album':
        $('iframe').contents()
          .find(`blockquote.pinned-topics #${currentTopic}`)
          .css('background-position', stickies.album);
        break;
      case topicImage === 'notice':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.notice);
        break;
      case topicImage === 'calendar':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.calendar);
        break;
      case topicImage === 'help':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.help);
        break;
      case topicImage === 'info':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.info);
        break;
      case topicImage === 'media':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.media);
        break;
      case topicImage === 'shows':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.shows);
        break;
      default:
        // album
        break;
    }
  });

  // unbind old listeners
  $(`#pinned-topics-panel input:required`).unbind();

  // live preview for pinned links
  pinnedLinksLivePreview(topicSettings.counter);

  // live preview for pinned menus
  pinnedMenulinksLivePreview(topicSettings.counter);

  // URL keyup listener
  URLkeyupListener();

  // validation for required input forms
  $('#pinned-topics-panel input:required').keyup((event) => {
    pinnedTopicsTestRequiredFields();
  });

  // fade in markup
  $(`#topic${topicSettings.counter}`).hide().fadeIn(200, $.bez(bezierEasing));
}

// live preview markup
$('#pinned-topics-checkbox:checkbox').change(() => {
  if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
    $('iframe').contents().find('.usertext-body .md').prepend(`
      <blockquote class="pinned-topics"></blockquote>
    `);

    $('iframe').contents().find('head').append(`
      <style class="pinned-topics" type="text/css">
        .res-nightmode .titlebox blockquote p a {
          color: rgba(255, 255, 255, 0.7);
        }
        .res-nightmode .titlebox blockquote ul {
          background-color: #303030 !important;
        }
        .res-nightmode .titlebox blockquote ul li:first-of-type {
          color: rgba(255, 255, 255, 0.7);
          background-color: #303030;
        }
        .res-nightmode .titlebox blockquote ul li:not(:first-of-type) {
          color: rgba(255, 255, 255, 0.7);
          background-color: #303030;
        }
        .res-nightmode .titlebox blockquote ul li:not(:first-of-type):hover {
          color: ${$('#lightPrimaryColorPicker').val()};
        }
        .res-nightmode .titlebox blockquote ul li:not(:first-of-type) a {
          color: rgba(255, 255, 255, 0.7);
        }
        .titlebox blockquote {
          border: 0;
          margin: 0 !important;
          padding: 0;
        }
        .titlebox blockquote p,
        .titlebox blockquote ul,
        .titlebox blockquote a {
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
        }
        .titlebox blockquote p,
        .titlebox blockquote ul {
          background: url(${stickies.URL}) no-repeat 0 -10px;
        }
        .titlebox blockquote p {
          width: 100%;
          height: 40px;
          background-color: ${$('#primaryColorPicker').val()};
        }
        .titlebox blockquote p:hover {
          background-color: ${$('#lightPrimaryColorPicker').val()};
        }
        .titlebox blockquote p a {
          display: block;
          height: 40px;
          border-color: transparent;
          border-style: solid;
          border-width: 0 0 0 60px;
          padding: 0;
          line-height: 40px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: bold;
          background-color: ${$('#primaryColorPicker').val()};
          background-clip: padding-box;
        }
        .titlebox blockquote p a:hover {
          background-color: ${$('#lightPrimaryColorPicker').val()};
          color: #fff;
        }
        .titlebox blockquote ul {
          padding: 0;
          margin-bottom: 8px;
          background-color: #fafafa;
        }
        .titlebox blockquote ul li {
          list-style-type: none;
        }
        .titlebox blockquote ul li:first-of-type {
          height: 40px;
          margin-left: 60px;
          font-size: 14px;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.54);
          line-height: 40px;
          background-color: #fafafa;
        }
        .titlebox blockquote ul li:not(:first-of-type) {
          padding: 5px 0 5px 30px;
          line-height: 20px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.54);
          background-color: #fafafa;
        }
        .titlebox blockquote ul li:not(:first-of-type):hover {
          background-color: rgba(97, 97, 97, 0.9);
        }
        .titlebox blockquote ul li:not(:first-of-type):hover a {
          font-weight: bold;
          color: ${$('#lightPrimaryColorPicker').val()};
        }
        .titlebox blockquote ul li:not(:first-of-type) a {
          display: block;
          color: rgba(0, 0, 0, 0.54);
        }
      </style>
    `);
  } else {
    $('iframe').contents().find('head .pinned-topics').detach();
    $('iframe').contents().find('.md .pinned-topics').detach();
  }
});

// pinned topics controls
$('#pinned-topics-checkbox:checkbox').change(() => {
  let bezierEasing = [0.4, 0, 0.2, 1];

  if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
    // show and enable control buttons div
    $('#pinned-topics-control').show(200, $.bez(bezierEasing))
      .fadeIn(200, $.bez(bezierEasing));

    // enable buttons
    $('#add-topic').prop('disabled', false);

    // reset topicSettings object
    topicSettings.reset();

    // prepopulate with 1 topic
    addTopic();

    // validation for required input forms
    pinnedTopicsTestRequiredFields();
  } else {
    // hide and disable control buttons div
    $('#pinned-topics-control').hide(200, $.bez(bezierEasing))
      .fadeOut(200, $.bez(bezierEasing));

    // disable buttons
    $('#add-topic').prop('disabled', true);
    $('#remove-topic').prop('disabled', true);

    // clear topics, data, and event handlers
    $('#pinned-topics-config').empty();

    // clear warning labels and enable compile button
    pinnedTopicsValidation('enable');
  }
});

// add topic
$('#add-topic').click((event) => {
  addTopic();
});

// remove topic
$('#remove-topic').click((event) => {
  let bezierEasing = [0.4, 0, 0.2, 1];
  if (topicSettings.counter > 1) {
    // delete key
    delete topicSettings[`topic${topicSettings.counter}`];

    // remove markup and all bound events
    $('#pinned-topics-config .pinned-topic').last()
      .fadeOut(200, $.bez(bezierEasing), () => {
        $('#pinned-topics-config .pinned-topic').last().remove();
    });

    // decrement counter
    topicSettings.counter--;
  }

  // disable remove topic button if only 1 topic remains
  if (topicSettings.counter === 1) {
    $('#remove-topic').prop('disabled', true);
  }

  // live preview
  $('iframe').contents().find('blockquote.pinned-topics').children().last()
    .remove();
});