import { fileTypeFromBuffer } from 'file-type'; // optional: detects file type from buffer

async function isXMLFile(file) {
  if (!file || !file.buffer) return false;

  const buffer = file.buffer;

  const fileType = await fileTypeFromBuffer(buffer).catch(() => null);

  if (fileType?.mime && fileType.mime !== 'application/xml' && fileType.mime !== 'text/xml') {

    return false;
  }


  const header = buffer.slice(0, 100).toString('utf8').trim();

 
  const isLikelyXML =
    header.startsWith('<?xml') ||
    /^<\s*[a-zA-Z_][\w:\-]*/.test(header);

  if (!isLikelyXML) return false;

  return true;
}

export {isXMLFile}
