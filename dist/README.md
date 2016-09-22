# flattish.css
**Flattish** is a Reddit CSS theme written according to Google's [Material Design](https://www.google.com/design/spec/material-design/introduction.html) specifications.

![Flattish](http://i.imgur.com/BMFkbxy.png)

## Features

Flattish draws heavily from Material Design, from its animations to color palettes to components, including buttons, cards, dialogs, lists, menus, tabs, and more. The stylesheet is designed around Google's [Roboto](https://material-design.storage.googleapis.com/publish/material_v_8/material_ext_publish/0B0J8hsRkk91LRjU4U1NSeXdjd1U/RobotoTTF.zip) font, which is free to download.

### Material components and animations

Tabs and buttons will trigger animations and effects on hovering or clicking.

![upvote](https://i.imgur.com/HPRckzs.gif)

![save](http://i.imgur.com/W9wcwxm.gif)

![tabs](http://i.imgur.com/eMeCe1Q.gif)

### Night mode

Flattish also features a dark theme for RES night mode users!

![nightmode](http://i.imgur.com/ZDCfeGs.png)

### Addons

Flattish can be extended with several addons. Refer to the [wiki](https://github.com/emyarod/flattish/wiki) for more details.

#### Large header

This addon will increase the height of the header to accomodate larger images. Large header images should be 420px tall.

![large-header](http://i.imgur.com/kDHN3Uk.jpg)

#### Rotating header image

When you load a page on your subreddit, this addon will randomly choose from a selection of header images in the stylesheet and alternate between the choices. This addon requires a minimum of 2 header images to alternate between, while supporting up to 36 unique headers.

Examples of this addon in action can be seen on subreddits like [/r/kpop](https://www.reddit.com/r/kpop)

#### Sidebar image

Display an image on the sidebar of your subreddit. Sidebar images should be 330px wide. Depending on the height of your image, you will have to edit the base CSS.

![sidebar-image](http://i.imgur.com/RFUU8Pf.gif)

#### Pinned topics

Pin important announcements, content, or resources next to the main list of posts. Pinned content can be in the form of links or dropdown menus. Choose from seven different icons to represent each pinned item.

![pinned-topics](http://i.imgur.com/rgidfhZ.gif)

## Setup and installation

There are three options to get started with using flattish:

* Customize your own version of flattish with the [theme editor](#customize)

* [Download](#download) and use the latest release build

* Use the latest, untested, and unreleased [development build](#help-develop-flattish)

#### Customize

[Use the flattish customizer to tailor the base stylesheet to your sub!](http://emyarod.github.io/flattish/) This option allows for the quickest vanilla setup out of the box, while also being the easiest to customize right from the start.

#### Download

[Download the latest release of flattish.css from the project's releases page!](https://github.com/emyarod/flattish/releases) This option allows for more control over the changes you wish to make to the base theme, but is also more complicated to extend compared to using the theme editor.

#### Help develop flattish

If you wish to develop the latest, cutting edge (and not completely tested) version of flattish:

1. Clone the flattish repo: `git clone https://github.com/emyarod/flattish.git`
2. Setup and install the necessary dependencies, [Sass](https://github.com/sass/sass) and [Bourbon](http://bourbon.io/)

---

**After moving the stylesheet to your subreddit and uploading all of the necessary images, be sure to do the following:**

* Add the following line to the sidebar of your subreddit

`[This subreddit is night mode compatible](#/RES_SR_Config/NightModeCompatible)`

* Edit subreddit settings to label submit buttons (/r/yoursubreddit/about/edit)

![submit-labels](http://i.imgur.com/62oZlBf.png)

---

## Contributing

If you come across a bug while using flattish, please help me by [reporting the bug on GitHub](https://github.com/emyarod/flattish/issues) or by submitting a bug report post on [/r/flattish](https://www.reddit.com/r/flattish).

## Shoutouts

* [Google Material Design guidelines](https://www.google.com/design/spec/material-design/introduction.html) & [Material Design Lite](https://github.com/google/material-design-lite)
* [Google Material icons](https://design.google.com/icons/)
* [Ionicons](http://ionicons.com/)
* [Sass Burger](https://github.com/jorenvanhee/sass-burger)
* [kazuend](https://twitter.com/kazuend)
* [Stitches](https://github.com/draeton/stitches)
* [Hover.css](https://github.com/IanLunn/Hover)
* Kel Diobrando
* traducer