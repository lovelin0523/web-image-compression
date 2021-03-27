/**
 * 实现前端本地压缩图片
 */
class ImageCompression {
	constructor(options) {
		this.$options = options;
		this.width = null; //压缩图片的宽，单位px，如果不设置默认为原图宽
		this.quality = 0.8; //压缩图片质量，默认为原图的0.8
		this.mimeType = 'png';//图片类型，默认为png
		this._init();
	}

	//初始化参数
	_init() {
		if(typeof this.$options != 'object' && !this.$options){
			this.$options = {};
		}
		if (this.$options.width && typeof(this.$options.width) == 'number' && this.$options.width > 0) {
			this.width = this.$options.width;
		}
		if (this.$options.quality && typeof(this.$options.quality) == 'number' && this.$options.quality > 0) {
			this.quality = this.$options.quality;
		}
		if(this.$options.mimeType && typeof this.$options.mimeType == 'string'){
			this.mimeType = this.$options.mimeType;
		}
	}

	/**
	 * 图片压缩方法，传入文件对象
	 * @param {Object} file
	 */
	compress(file) {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			var img = new Image;
			reader.onload = e => {
				img.src = reader.result;
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				img.onload = () => {
					canvas.width = this.width || img.width;
					canvas.height = this.width?(this.width / (img.width / img.height)):img.height;
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
					var url = canvas.toDataURL("image/"+this.mimeType, this.quality);
					var compressionFile = this._dataBase64toFile(url,file.name);
					resolve(compressionFile);
				}
				img.onerror = error => {
					reject(error)
				}
			}

			reader.onerror = error => {
				reject(error);
			}
		})
	}
	
	/**
	 * 将base64位格式文件转换为file对象
	 * @param {Object} base64String
	 * @param {Object} fileName
	 */
	_dataBase64toFile(base64String, fileName) {
		let arr = base64String.split(',');
		let mime = arr[0].match(/:(.*?);/)[1];
		let bstr = atob(arr[1]);
		let n = bstr.length;
		let u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], fileName, {
			type: mime,
		});
	}
}

const packages = require('../package.json');

console.log('%c感谢使用' + packages.name + '，当前版本：%c v' + packages.version + '\n%c' + packages.name +
	'完全由个人开发，如果你觉得还不错的话，欢迎前往github给个star，感谢！\ngithub地址：%c' + packages.github, 'color:#808080;', 'color:#008a00',
	'color:#808080;', 'color:#008a00');


module.exports = ImageCompression;
