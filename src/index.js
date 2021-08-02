/**
 * 实现前端本地压缩图片
 */
class ImageCompression {
	constructor(options) {
		this.$options = options;
		this.width = null; //压缩图片的宽，单位px，如果不设置默认为原图宽
		this.quality = 0.8; //压缩图片质量，默认为原图的0.8
		this.mimeType = 'jpeg';//图片类型，jpeg或者webp，默认为jpeg
		this.maxSize = 0;//压缩后的最大值，单位kb，默认为0表示不设置此值
		this.minSize = 0;//小于该大小的图片不进行压缩，单位kb，默认为0表示任何图片都要压缩
		this._init();
	}

	//初始化参数
	_init() {
		if(typeof this.$options != 'object' && !this.$options){
			this.$options = {};
		}
		if (this.$options.width && typeof this.$options.width == 'number' && this.$options.width > 0) {
			this.width = this.$options.width;
		}
		if (this.$options.quality && typeof this.$options.quality == 'number' && this.$options.quality > 0) {
			this.quality = this.$options.quality;
		}
		if(this.$options.mimeType && typeof this.$options.mimeType == 'string'){
			this.mimeType = this.$options.mimeType;
		}
		if (this.$options.maxSize && typeof this.$options.maxSize == 'number' && this.$options.maxSize > 0) {
			this.maxSize = this.$options.maxSize;
		}
		if (this.$options.minSize && typeof this.$options.minSize == 'number' && this.$options.minSize > 0) {
			this.minSize = this.$options.minSize;
		}
	}

	/**
	 * 图片压缩方法，传入文件对象
	 * @param {Object} file
	 */
	compress(file) {
		return new Promise((resolve, reject) => {
			//小于minSize的图片不压缩
			if(this.minSize > 0 && file.size <= this.minSize * 1024){
				resolve(file);
				return;
			}
			let reader = new FileReader();
			reader.readAsDataURL(file);
			let img = new Image;
			reader.onload = e => {
				img.src = reader.result;
				let canvas = document.createElement('canvas');
				let context = canvas.getContext('2d');
				img.onload = () => {
					//获取生成的文件
					let compressionFile = this._createFile(canvas,context,img,file);
					resolve(compressionFile);
				}
				img.onerror = error => {
					reject(new Error('加载图片失败'))
				}
			}

			reader.onerror = error => {
				reject(new Error('读取文件失败'));
			}
		})
	}
	
	/**
	 * 压缩实现
	 */
	_createFile(canvas,context,img,file){
		canvas.width = this.width || img.width;
		canvas.height = this.width?(this.width / (img.width / img.height)):img.height;
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
		let url = canvas.toDataURL("image/"+this.mimeType, this.quality);
		let compressionFile = this._dataBase64toFile(url,this._newFileName(file.name));
		//比最大尺寸大，继续压缩，此时会降低质量
		if(this.maxSize > 0 && compressionFile.size > this.maxSize * 1024){
			this.quality = (this.quality <= 0.1?0.1:this.quality-0.1);
			compressionFile = this._createFile(canvas,context,img,file)
		}
		return compressionFile;
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
	
	/**
	 * 生成新的文件名称
	 * @param {Object} fileName
	 */
	_newFileName(fileName){
		let index = fileName.lastIndexOf('.');
		let suffix = fileName.substr(index);
		let name = fileName.substr(0,index);
		return name + '.' + this.mimeType;
	}
}

const packages = require('../package.json');

console.log('%c感谢使用' + packages.name + '，当前版本：%c v' + packages.version + '\n%c如果你觉得' + packages.name +
	'还不错，不妨去github点个star\ngithub地址：%c' + packages.repository.url, 'color:#808080;', 'color:#008a00',
	'color:#808080;', 'color:#008a00');


module.exports = ImageCompression;
