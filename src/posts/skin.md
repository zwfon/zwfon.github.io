---
icon: edit
date: 2023-04-10
category:
  - Flutter
tag:
  - fplayer
  - skin
star: true
sticky: true
---

# fplayer—Flutter播放器插件

如何使用 fplayer 插件内置 UI 以及怎样构建自定义视频播放器？

fplayer 是一个 Flutter 插件，用于在移动应用程序中实现视频播放功能。该插件提供了丰富的 API 和可定制的 UI，可以满足不同应用场景的需求。在本文中，我们将介绍如何使用 fplayer 插件及其官网内置 UI 构建一个自定义的视频播放器。

### 第一步：安装 fplayer 插件

首先，我们需要在 Flutter 项目中安装 fplayer 插件。可以通过在项目的 `pubspec.yaml` 文件中添加以下依赖来完成安装：

```
dependencies:
  fplayer: ^1.0.2

```

然后，在项目目录中运行 `flutter pub get` 命令来安装插件。

### 第二步：使用 fplayer 官网内置 UI

fplayer 官网提供了一些内置的 UI 样式，可以直接在项目中使用。以下是一个示例代码，展示如何使用内置 UI 样式来构建视频播放器：

```dart
import 'package:flutter/material.dart';
import 'package:fplayer/fplayer.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'fplayer Demo',
      theme: ThemeData(
        primaryColor: const Color(0xFF07B9B9),
        primaryColorDark: const Color(0xFFFFFFFF),
        primaryColorLight: const Color(0x33000000),
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            overlayColor: MaterialStateProperty.all(Colors.transparent),
          ),
        ),
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final FPlayer player = FPlayer();

  // 视频列表
  List<VideoItem> videoList = [
    VideoItem(
      title: '第一集',
      subTitle: '视频1副标题',
      url: 'http://player.alicdn.com/video/aliyunmedia.mp4',
    ),
    VideoItem(
      title: '第二集',
      subTitle: '视频2副标题',
      url: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
    ),
    VideoItem(
      title: '第三集',
      subTitle: '视频3副标题',
      url: 'http://player.alicdn.com/video/aliyunmedia.mp4',
    ),
  ];

  // 视频索引,单个视频可不传
  int videoIndex = 0;

  // 播放传入的url
  Future<void> setVideoUrl(String url) async {
    try {
      await player.setDataSource(url, autoPlay: true, showCover: true);
    } catch (error) {
      print("播放-异常: $error");
      return;
    }
  }

  @override
  void initState() {
    super.initState();
    setVideoUrl(videoList[videoIndex].url);
  }

  @override
  void dispose() {
    super.dispose();

    player.release();
  }

  @override
  Widget build(BuildContext context) {
    MediaQueryData mediaQueryData = MediaQuery.of(context);
    Size size = mediaQueryData.size;
    double videoHeight = size.width * 9 / 16;
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Column(
        children: [
          FView(
            player: player,
            width: double.infinity,
            height: videoHeight, // 需自行设置，此处宽度/高度=16/9
            color: Colors.black,
            fsFit: FFit.contain, // 全屏模式下的填充
            fit: FFit.fill, // 正常模式下的填充
            panelBuilder: fPanelBuilder(
              // 视频列表开关
              videos: true,
              // 视频列表列表
              videoMap: videoList,
              // 当前视频索引
              videoIndex: videoIndex,
              // 播放下一集视频回调
              playNextVideoFun: () {
                setState(() {
                  videoIndex += 1;
                });
              },
              // 视频播放错误点击刷新回调
              onVideoEnd: () async {
                // 视频结束最后一集的时候会有个UI层显示出来可以触发重新开始
                var index = videoIndex + 1;
                if (index < videoList.length) {
                  await player.reset();
                  setState(() {
                    videoIndex = index;
                  });
                  setVideoUrl(videoList[index].url);
                }
              },
            ),
          ),
          // 自定义小屏列表
          Container(
            width: double.infinity,
            height: 30,
            margin: const EdgeInsets.all(20),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.zero,
              itemCount: videoList.length,
              itemBuilder: (context, index) {
                bool isCurrent = videoIndex == index;
                Color textColor = Theme.of(context).primaryColor;
                Color bgColor = Theme.of(context).primaryColorDark;
                Color borderColor = Theme.of(context).primaryColor;
                if (isCurrent) {
                  textColor = Theme.of(context).primaryColorDark;
                  bgColor = Theme.of(context).primaryColor;
                  borderColor = Theme.of(context).primaryColor;
                }
                return GestureDetector(
                  onTap: () async {
                    await player.reset();
                    setState(() {
                      videoIndex = index;
                    });
                    setVideoUrl(videoList[index].url);
                  },
                  child: Container(
                    margin: EdgeInsets.only(left: index == 0 ? 0 : 10),
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(5),
                      color: bgColor,
                      border: Border.all(
                        width: 1.5,
                        color: borderColor,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      videoList[index].title,
                      style: TextStyle(
                        fontSize: 15,
                        color: textColor,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

在上述代码中，我们使用 `FView` 组件来构建一个视频播放器，其中 `fPanelBuilder` 参数为内置UI组件，下面是对组件内的参数介绍:

属性：

| 属性名 | 类型 | 描述 |
| --- | --- | --- |
| title | String | 单视频模式视频标题 |
| subTitle | String | 单视频模式视频副标题 |
| isSnapShot | bool | 是否显示截图按钮，默认为false |
| isRightButton | bool | 是否显示全屏模式中间区域右上方按钮组，默认为false |
| rightButtonList | List | 全屏模式中间区域右上方按钮组，建议不要超过三个 |
| isVideos | bool | 是否为多视频模式，默认为false |
| videoList | List | 多视频列表 |
| speedList | List | 倍速列表 |
| isResolution | bool | 是否显示清晰度按钮，默认为false |
| resolutionList | List | 清晰度列表 |

方法：

| 方法名 | 描述 |
| --- | --- |
| playNextVideoFun | 多视频模式全屏状态下点击播放下一集按钮事件 |
| settingFun | 点击右上角设置按钮事件 |
| onError | 视频播放错误点击刷新回调 |
| onVideoEnd | 视频播放完成回调 |
| onVideoTimeChange | 视频事件变动则触发一次，可以保存视频播放历史 |
| onVideoPrepared | 视频初始化完毕回调，如有历史记录时间段则可以触发快进 |

### 第三步：自定义 fplayer 样式

如果您不希望使用内置 UI 样式，也可以自定义 fplayer 样式。以下是一个示例代码，展示如何自定义样式：

```dart
class CustomFPanel extends StatefulWidget {
  final FPlayer player;
  final BuildContext buildContext;
  final Size viewSize;
  final Rect texturePos;

  const CustomFPanel({
    @required this.player,
    this.buildContext,
    this.viewSize,
    this.texturePos,
  });

  @override
  _CustomFPanelState createState() => _CustomFPanelState();
}

class _CustomFPanelState extends State<CustomFPanel> {

  FPlayer get player => widget.player;
  bool _playing = false;

  @override
  void initState() {
    super.initState();
    widget.player.addListener(_playerValueChanged);
  }

  void _playerValueChanged() {
    FValue value = player.value;

    bool playing = (value.state == FState.started);
    if (playing != _playing) {
      setState(() {
        _playing = playing;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Rect rect = Rect.fromLTRB(
      max(0.0, widget.texturePos.left),
      max(0.0, widget.texturePos.top),
      min(widget.viewSize.width, widget.texturePos.right),
      min(widget.viewSize.height, widget.texturePos.bottom),
    );
    return Positioned.fromRect(
      rect: rect,
      child: Container(
        alignment: Alignment.bottomLeft,
        child: IconButton(
          icon: Icon(
            _playing ? Icons.pause : Icons.play_arrow,
            color: Colors.white,
          ),
          onPressed: () {
            _playing ? widget.player.pause() : widget.player.start();
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    player.removeListener(_playerValueChanged);
  }
}

```

在上述代码中，我们创建了CustomFPanel组件，接下来只需要把这个组件传入Fview的`panelBuilder`参数，一个简单的自定义皮肤就实现了。

```dart
FView(
  player: player,
  panelBuilder: (
    FPlayer player,
    FData data,
    BuildContext context,
    Size viewSize,
    Rect texturePos,
  ) {
    return CustomFPanel(
      player: player,
      buildContext: context,
      viewSize: viewSize,
      texturePos: texturePos,
    );
  },
)
```

### 结论

在本文中，我们介绍了如何使用 fplayer 插件及其官网内置 UI 以及构建自定义的视频播放器。无论您是想使用内置样式还是自定义样式，fplayer 都提供了丰富的 API 和可定制的 UI，可以满足不同应用场景的需求。如果您正在开发一款移动应用程序并需要视频播放功能，fplayer 可以是一个不错的选择。更多关于fplayer的内容请查看[fplayer官网](https://fplayer.dev)。
