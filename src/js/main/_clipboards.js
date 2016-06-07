// copy to clipboard buttons
export default function initializeClipboards() {
  let clipboards = ['target', 'sidebarmd'];
  clipboards.forEach((element, index, array) => {
    // initialize tooltips
    $(`#${element}-clipboard`).tooltip({
      container: 'body',
    });

    $(`#${element}-clipboard`).click(() => {
      /**
       * create a Range interface
       * set the Range to contain the chosen Node and its elements
       * make sure nothing is preselected
       * add Range to Selection
       */
      if (document.selection) {
        // for IE
        let range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(`${element}`));
        range.select();
      } else if (window.getSelection) {
        let range = document.createRange();
        range.selectNode(document.getElementById(`${element}`));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }

      // copy highlighted text
      try {
        let success = document.execCommand('copy');
        if (success) {
          // change tooltip text
          $(`#${element}-clipboard`).trigger('copied', ['Copied!']);

          // un-highlight text
          window.getSelection().removeAllRanges();
        } else {
          $(`#${element}-clipboard`).trigger('copied', ['Copy with Ctrl-c']);
        }
      } catch (err) {
        $(`#${element}-clipboard`).trigger('copied', ['Copy with Ctrl-c']);
      }
    });

    /**
     * update tooltip title
     *
     * edit title based on try...catch statement, then reset title to default
     *
     * fixTitle method found in Bootstrap source code
     *   - fetches and replaces `data-original-title` attribute
     */
    $(`#${element}-clipboard`).bind('copied', (event, message) => {
      $(event.currentTarget).attr('title', message)
        .tooltip('fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('fixTitle');
    });
  });
}