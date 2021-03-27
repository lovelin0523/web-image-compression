#### rem-fit
> 一个轻量级的简单的web前端图片压缩插件


```
npm install web-image-compression
```

```
import ImageCompression from "web-image-compression"
var imageCompression = new ImageCompression({
	width:1920,
	quality:0.6,
	mimeType:'webp'
})
imageCompression.compress(file).then(newFile=>{
	console.log(newFile)
})
```

### 具体使用方法请到我的网站查看：[web-image-compression](https://www.mvi-web.cn/library/24)