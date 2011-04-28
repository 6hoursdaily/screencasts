Ti.include('getLighterColor.js')
Ti.include('addEmptyRows.js')

Titanium.UI.setBacgroundColor('#EEE')

tabGroup = Titanium.UI.createTabGroup()

latestWindow = Titanium.UI.createWindow
  title: ''
  barImage: 'iphone-bar.png'
  backgroundImage: 'grid.png'

latestTab = Titanium.UI.createTab
  icon: '11-clock.png'
  title: 'Latest'
  window: latestWindow

navigationWindow = Titanium.UI.createWindow
  navBarHidden: true
  backgroundImage: 'grid.png'

topicsWindow = Titanium.UI.createWindow
  barImage: 'iphone-topics-bar.png'
  title: ''

nav = Ti.UI.iPhone.createNavigationGroup
  window: topicsWindow

navigationWindow.add(nav)

topicsTab = Titanium.UI.createTab
  window: navigationWindow
  title: 'topics'
  icon: '15-tags.png'

tabGroup.addTab(latestTab)
tabGroup.addTab(topicsTab)

tabGroup.open()

topicsTable = Titanium.UI.createTableView
  data: []
  backgroundColor: 'transparent'

topicsWindow.add(topicsTable)

# This will handle the JSON
xhrTopics = Titanium.Network.createHTTPClient()

xhrTopics.onload = () ->
  topics = JSON.parse(this.responseText)
  data = []

  for top in topics
    topic = topics[_i].topic
    customColor = if topic.color then topic.color else '#1169ae'
    lighterCustonColor = getLighterColor(customColor)

    row = Ti.UI.createTableViewRow
      hasChild: true
      height: 80
      topic: topic
      title: topic.name
      fontSize: 24
      color: '#fff'
      selectedBackgroundColor: '#ddd'
      backgroundGradient:
        type: 'linear'
        colors: [customColor, lighterCustonColor]
        startPoint:
          x: 0
          y: 0
        endPoint:
          x: 0
          y: 80
        backFillStart: false

    data.push(row)
  topicsTable.setData(data)

# This will pull the data from the webservice
xhrTopics.open('GET', 'http://screencasts.org/topics.json')
xhrTopics.send()


episodesToData = (episodes) ->
  data = []

  for epi in episodes
    episode = episodes[_i].episode

    row = Titanium.UI.createTableViewRow
      hasChild: true
      height: 80
      backgroundColor: '#fff'
      video_blip_id: episode.video_blip_id

    image = Titanium.UI.createImageView
      image: 'http://screencasts.org/thumbnails/'+episode.slug+'/280x150png'
      Ti.API.log('http://screencasts.org/thumbnails/'+episode.slug+'/280x150png')
      left: -155

    row.add(image)

    episodeTitle = Titanium.UI.createLabel
      text: episode.title
      Ti.API.log(episode.title)
      color: '#666666'
      left: 155
      font:
        fontSize: 13
      height: 70
      width: 135

    row.add(episodeTitle)
    data.push(row)
  data

singleTopicTitle = ''
singleTopicColor = ''

singleTopicTable = Titanium.UI.createTableView
  data: []
  backgroundColor: 'transparent'

singleTopicXhr = Titanium.Network.createHTTPClient()

singleTopicXhr.onload = () ->
  episodes = JSON.parse(this.responseText)
  data = episodesToData(episodes)

  addEmptyRows(data)
  singleTopicTable.setData(data)

  singleTopicWindow = Titanium.UI.createWindow
    title: singleTopicTitle
    barColor: singleTopicColor

  singleTopicWindow.add(singleTopicTable)
  singleTopicWindow.backButtonTitle = 'Topics'
  nav.open(singleTopicWindow)

topicsTable.addEventListener 'click', (e) ->
  singleTopicTitle = e.row.topic.name
  singleTopicColor = e.row.topic.color
  Ti.API.log('http://screencasts.org/topics/'+e.row.topic.slug+'.json')
  singleTopicXhr.open('GET', 'http://screencasts.org/topics/'+e.row.topic.slug+'.json')
  singleTopicXhr.send()


latestTable = Titanium.UI.createTableView
  data: []
  backgroundColor: 'transparent'

latestXhr = Titanium.Network.createHTTPClient()

latestXhr.onload = () ->
  latestEpisodes = JSON.parse(this.responseText)
  data = episodesToData(latestEpisodes)
  latestTable.setData(data)

latestWindow.add(latestTable)
latestXhr.open('GET', 'http://screencasts.org/episodes/latest.json')
latestXhr.send()

getVideoData = (jsonData) ->
  jsonData[0]

loadVideoXhr = Titanium.Network.createHTTPClient()
loadVideoXhr.onload = () ->
  blipTVjson = eval(this.responseText)

  blipTVURL = ''
  if Titanium.Platform.model == 'iPhone 4' or Titanium.Platform.model == 'Simulator'
    blipTVURL = blipTVjson.additionalMedia[2].url
  else
    blipTVURL = blipTVjson.mediaUrl

  videoPlayer = Titanium.Media.createVideoPlayer
    url: blipTVURL
    fullscreen: true

  videoWindow = Titanium.UI.createWindow
    navBarHidden: true
    isClosed: false
    orientationModes: [
      Titanium.UI.LANDSCAPE_RIGHT,
      Titanium.UI.LANDSCAPE_LEFT,
      Titanium.UI.PORTRAIT,
      Titanium.UI.UPSIDE_PORTRAIT
    ]

  videoPlayer.addEventListener 'fullscreen', (e) ->
    if !e.entering and !videoWindow.isClosed
      videoWindow.orientationModes = [Titanium.UI.PORTRAIT]
      videoPlayer.stop()
      videoWindow.close
        animated: false
      videoWindow.isClosed = true
      videoPlayer.release()

  videoWindow.open
    modal: true
    animated: false

  videoWindow.add(videoPlayer)
  videoPlayer.show()
  videoPlayer.play()


loadRemoteMovie = (e) ->
  if e.row.hasChild
    loadVideoXhr.open('GET', 'http://blip.tv/players/episode/'+e.row.video_blip_id+'?skin=json&callback=getVideoData&version=2')
    loadVideoXhr.send()

singleTopicTable.addEventListener 'click', loadRemoteMovie
latestTable.addEventListener 'click', loadRemoteMovie
