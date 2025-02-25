## 原理思路

- 创建一个canvas元素
- 创建一个 svg 文件，使用Blob构造函数
- 在 svg 标签中填充 foreignObject, 然后填充想要复制的 HTML
- 创建 Image 标签，将 image.src = URL.createObjectUrl(svg)
- image 读取完成后，调用canvas的 drawImage 方法将图片渲染到画布