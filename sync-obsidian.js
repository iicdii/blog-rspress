const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// 환경 변수에서 Obsidian Vault 경로를 가져옵니다.
const vaultPath = process.env.OBSIDIAN_VAULT_PATH;
const targetPath = path.join("docs", "articles");

// 지정된 경로에서 모든 Markdown 파일을 찾는 함수
function findAllMarkdownFiles(directory) {
  let filesToProcess = [];

  // 디렉토리 내부의 파일들을 반복 처리
  fs.readdirSync(directory, { withFileTypes: true }).forEach((file) => {
    const fullPath = path.join(directory, file.name);

    // 디렉토리인 경우 재귀적으로 처리
    if (file.isDirectory()) {
      filesToProcess = filesToProcess.concat(findAllMarkdownFiles(fullPath));
    } else if (file.isFile() && file.name.endsWith(".md")) {
      // Markdown 파일인 경우 목록에 추가
      filesToProcess.push(fullPath);
    }
  });

  return filesToProcess;
}

// Frontmatter를 파싱하고 필터링하는 함수
function filterPublishedFiles(files) {
  return files.filter((file) => {
    const content = fs.readFileSync(file, "utf8");
    const frontmatterMatch = content.match(/^-{3,}\s*\n([\s\S]+?)\n-{3,}/);

    // frontmatter가 없는 경우는 제외
    if (!frontmatterMatch) return false;

    // frontmatter 파싱
    try {
      const frontmatter = yaml.load(frontmatterMatch[1]);
      return frontmatter && frontmatter.published === true;
    } catch (error) {
      // YAML 파싱 에러가 발생한 경우, 해당 파일을 무시
      console.error(`YAML parsing error in file: ${file}`);
      return false;
    }
  });
}

// 파일을 복사하고 frontmatter를 수정하는 함수
function processFiles(files) {
  files.forEach((file) => {
    const relativePath = path.relative(vaultPath, file);
    // .md 확장자를 제거하고 .mdx 확장자를 추가
    const targetFilePath = path
      .join(targetPath, relativePath)
      .replace(/\.md$/, ".mdx");

    // 필요한 경우 디렉토리 생성
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });

    // 파일 내용 읽기
    const content = fs.readFileSync(file, "utf8");

    // Frontmatter와 나머지 내용 분리
    const frontmatterEndIndex = content.indexOf("---", 3); // 3은 첫번째 '---' 이후부터 검색
    let frontmatterPart = content.substring(3, frontmatterEndIndex).trim();
    let rest = content.substring(frontmatterEndIndex + 3);

    // Frontmatter 파싱 및 수정
    let frontmatter = yaml.load(frontmatterPart);
    frontmatter.title = path.basename(file, ".md");
    frontmatterPart = yaml.dump(frontmatter);

    // ArticleInfo 컴포넌트 임포트 경로 계산
    const importPath = path
      .relative(
        path.dirname(targetFilePath),
        path.join(process.cwd(), "components", "ArticleInfo")
      )
      .replace(/\\/g, "/");

    // 파일 내용 구성
    let newContent = `---\n${frontmatterPart}---\n\n`;
    newContent += `import ArticleInfo from '${importPath}'\n\n`;
    newContent += `# ${frontmatter.title}\n\n`;
    newContent += `<ArticleInfo />\n`;
    newContent += rest;

    // 파일에 다시 쓰기
    fs.writeFileSync(targetFilePath, newContent);
  });
}

// 메인 로직
function main() {
  const allFiles = findAllMarkdownFiles(vaultPath);
  const publishedFiles = filterPublishedFiles(allFiles);
  processFiles(publishedFiles);
}

main();
