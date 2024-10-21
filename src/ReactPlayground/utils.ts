import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import { Files } from "./PlaygroundContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const fileName2Language = (name: string) => {
  const suffix = name.split(".").pop() || "";
  if (["js", "jsx"].includes(suffix)) return "javascript";
  if (["ts", "tsx"].includes(suffix)) return "typescript";
  if (["json"].includes(suffix)) return "json";
  if (["css"].includes(suffix)) return "css";
  return "javascript";
};

// atob 和 btoa 是 二进制的 ASC 码和 base64 的字符串转换
export function compress(data: string): string {
  // 字符串转化字节数组
  const buffer = strToU8(data);
  // 压缩
  const zipped = zlibSync(buffer, { level: 9 });
  // 转化为字符串
  const str = strFromU8(zipped, true);
  return btoa(str);
}

export function decompress(data: string): string {
  const str = atob(data);
  const buffer = strToU8(str);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

// 下载代码
export async function downloadFiles(files: Files) {
  const zip = new JSZip();
  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].value);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`);
}
