const str = 'test\n::: show-site-info\nurl\n:::\ntest\n';
console.log(str)

// 使用正则表达式匹配并提取出 '::: show-site-info' 和 'url'
const regex = /:::\s*show-site-info\s*(.*?)\s*:::/;
//const match = str.match(regex);
const match = regex.exec(str);

if (match) {
  const siteInfo = match[0]; // 匹配到的完整字符串 '::: show-site-info\nurl\n:::'
  const siteUrl = match[1]; // 匹配到的网址 'url'
  console.log(siteInfo); // 输出 '::: show-site-info\nurl\n:::'
  console.log(siteUrl); // 输出 'url'
} else {
  console.log('未找到匹配的字符串');
}
