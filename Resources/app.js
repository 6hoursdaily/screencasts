var episodesToData, getVideoData, latestTab, latestTable, latestWindow, latestXhr, loadRemoteMovie, loadVideoXhr, nav, navigationWindow, singleTopicColor, singleTopicTable, singleTopicTitle, singleTopicXhr, tabGroup, topicsTab, topicsTable, topicsWindow, xhrTopics;
Ti.include('getLighterColor.js');
Ti.include('addEmptyRows.js');
Titanium.UI.setBacgroundColor('#EEE');
tabGroup = Titanium.UI.createTabGroup();
latestWindow = Titanium.UI.createWindow({
  title: '',
  barImage: 'iphone-bar.png',
  backgroundImage: 'grid.png'
});
latestTab = Titanium.UI.createTab({
  icon: '11-clock.png',
  title: 'Latest',
  window: latestWindow
});
navigationWindow = Titanium.UI.createWindow({
  navBarHidden: true,
  backgroundImage: 'grid.png'
});
topicsWindow = Titanium.UI.createWindow({
  barImage: 'iphone-topics-bar.png',
  title: ''
});
nav = Ti.UI.iPhone.createNavigationGroup({
  window: topicsWindow
});
navigationWindow.add(nav);
topicsTab = Titanium.UI.createTab({
  window: navigationWindow,
  title: 'topics',
  icon: '15-tags.png'
});
tabGroup.addTab(latestTab);
tabGroup.addTab(topicsTab);
tabGroup.open();
topicsTable = Titanium.UI.createTableView({
  data: [],
  backgroundColor: 'transparent'
});
topicsWindow.add(topicsTable);
xhrTopics = Titanium.Network.createHTTPClient();
xhrTopics.onload = function() {
  var customColor, data, lighterCustonColor, row, top, topic, topics, _i, _len;
  topics = JSON.parse(this.responseText);
  data = [];
  for (_i = 0, _len = topics.length; _i < _len; _i++) {
    top = topics[_i];
    topic = topics[_i].topic;
    customColor = topic.color ? topic.color : '#1169ae';
    lighterCustonColor = getLighterColor(customColor);
    row = Ti.UI.createTableViewRow({
      hasChild: true,
      height: 80,
      topic: topic,
      title: topic.name,
      fontSize: 24,
      color: '#fff',
      selectedBackgroundColor: '#ddd',
      backgroundGradient: {
        type: 'linear',
        colors: [customColor, lighterCustonColor],
        startPoint: {
          x: 0,
          y: 0
        },
        endPoint: {
          x: 0,
          y: 80
        },
        backFillStart: false
      }
    });
    data.push(row);
  }
  return topicsTable.setData(data);
};
xhrTopics.open('GET', 'http://screencasts.org/topics.json');
xhrTopics.send();
episodesToData = function(episodes) {
  var data, epi, episode, episodeTitle, image, row, _i, _len;
  data = [];
  for (_i = 0, _len = episodes.length; _i < _len; _i++) {
    epi = episodes[_i];
    episode = episodes[_i].episode;
    row = Titanium.UI.createTableViewRow({
      hasChild: true,
      height: 80,
      backgroundColor: '#fff',
      video_blip_id: episode.video_blip_id
    });
    image = Titanium.UI.createImageView({
      image: 'http://screencasts.org/thumbnails/' + episode.slug + '/280x150png'
    }, Ti.API.log('http://screencasts.org/thumbnails/' + episode.slug + '/280x150png'), {
      left: -155
    });
    row.add(image);
    episodeTitle = Titanium.UI.createLabel({
      text: episode.title
    }, Ti.API.log(episode.title), {
      color: '#666666',
      left: 155,
      font: {
        fontSize: 13
      },
      height: 70,
      width: 135
    });
    row.add(episodeTitle);
    data.push(row);
  }
  return data;
};
singleTopicTitle = '';
singleTopicColor = '';
singleTopicTable = Titanium.UI.createTableView({
  data: [],
  backgroundColor: 'transparent'
});
singleTopicXhr = Titanium.Network.createHTTPClient();
singleTopicXhr.onload = function() {
  var data, episodes, singleTopicWindow;
  episodes = JSON.parse(this.responseText);
  data = episodesToData(episodes);
  addEmptyRows(data);
  singleTopicTable.setData(data);
  singleTopicWindow = Titanium.UI.createWindow({
    title: singleTopicTitle,
    barColor: singleTopicColor
  });
  singleTopicWindow.add(singleTopicTable);
  singleTopicWindow.backButtonTitle = 'Topics';
  return nav.open(singleTopicWindow);
};
topicsTable.addEventListener('click', function(e) {
  singleTopicTitle = e.row.topic.name;
  singleTopicColor = e.row.topic.color;
  Ti.API.log('http://screencasts.org/topics/' + e.row.topic.slug + '.json');
  singleTopicXhr.open('GET', 'http://screencasts.org/topics/' + e.row.topic.slug + '.json');
  return singleTopicXhr.send();
});
latestTable = Titanium.UI.createTableView({
  data: [],
  backgroundColor: 'transparent'
});
latestXhr = Titanium.Network.createHTTPClient();
latestXhr.onload = function() {
  var data, latestEpisodes;
  latestEpisodes = JSON.parse(this.responseText);
  data = episodesToData(latestEpisodes);
  return latestTable.setData(data);
};
latestWindow.add(latestTable);
latestXhr.open('GET', 'http://screencasts.org/episodes/latest.json');
latestXhr.send();
getVideoData = function(jsonData) {
  return jsonData[0];
};
loadVideoXhr = Titanium.Network.createHTTPClient();
loadVideoXhr.onload = function() {
  var blipTVURL, blipTVjson, videoPlayer, videoWindow;
  blipTVjson = eval(this.responseText);
  blipTVURL = '';
  if (Titanium.Platform.model === 'iPhone 4' || Titanium.Platform.model === 'Simulator') {
    blipTVURL = blipTVjson.additionalMedia[2].url;
  } else {
    blipTVURL = blipTVjson.mediaUrl;
  }
  videoPlayer = Titanium.Media.createVideoPlayer({
    url: blipTVURL,
    fullscreen: true
  });
  videoWindow = Titanium.UI.createWindow({
    navBarHidden: true,
    isClosed: false,
    orientationModes: [Titanium.UI.LANDSCAPE_RIGHT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]
  });
  videoPlayer.addEventListener('fullscreen', function(e) {
    if (!e.entering && !videoWindow.isClosed) {
      videoWindow.orientationModes = [Titanium.UI.PORTRAIT];
      videoPlayer.stop();
      videoWindow.close({
        animated: false
      });
      videoWindow.isClosed = true;
      return videoPlayer.release();
    }
  });
  videoWindow.open({
    modal: true,
    animated: false
  });
  videoWindow.add(videoPlayer);
  videoPlayer.show();
  return videoPlayer.play();
};
loadRemoteMovie = function(e) {
  if (e.row.hasChild) {
    loadVideoXhr.open('GET', 'http://blip.tv/players/episode/' + e.row.video_blip_id + '?skin=json&callback=getVideoData&version=2');
    return loadVideoXhr.send();
  }
};
singleTopicTable.addEventListener('click', loadRemoteMovie);
latestTable.addEventListener('click', loadRemoteMovie);
