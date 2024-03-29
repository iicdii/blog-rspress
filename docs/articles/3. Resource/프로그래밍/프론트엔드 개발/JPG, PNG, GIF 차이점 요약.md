---
tags:
  - ImageFormats
created: 2022-03-02T00:00:00.000Z
published: true
title: JPG, PNG, GIF 차이점 요약
---

# JPG, PNG, GIF 차이점 요약

📅 2022. 03. 02

![](https://i.imgur.com/K9Q68mR.png)
**TL;DR: 좋은 화질은 PNG, 작은 용량은 JPG, 움짤은 GIF**
# JPG(JPEG)
![](https://i.imgur.com/wWFrams.png)


- 발음: 제이-피-이지 or 제이-팩 (제이팍 아님)
- 손실 압축 포맷
  - 인간이 지각하기 힘든 범위의 데이터를 버리고 압축하는 방법을 사용하는 포맷
- **"난 화질은 좀 별로여도 용량이 작았으면 좋겠어"**
- 1px이 24bits(트루 컬러)의 색상 표현 가능 (2^24)
  - 8bits는 인덱스 컬러(Indexed Color)라고 하며 1픽셀이 2^8개의 색 표현이 가능함
  - 16bits는 하이 컬러(High Color)라고 하며 1픽셀이 2^16개의 색 표현이 가능함
  - 24bits는 트루 컬러(True color)라고 하며 1픽셀이 2^24개의 색 표현이 가능함
- 다채로운 색상 표현 가능 -> **현실 사진에 적합**

# PNG
![](https://i.imgur.com/ay0qJgP.png)


- 무손실 압축 포맷
  - 압축을 하되 원본과 동일한 형태를 유지하는 압축 포맷
- **"난 용량은 커도 화질이 좋았으면 좋겠어"**
- 알파 채널(투명 채널) 지원
  - RGB와는 별도로 A(Alpha) 채널이 있음 
- 알고리즘 구조상 동일한 패턴이 많을수록 압축률이 좋음 -> **현실 사진보다는 단순한 이미지에 적합** (태블릿에서 그린 그림 등)
- PNG-8(인덱스 컬러), PNG-24(트루 컬러)가 있음
  - PNG-8은 GIF보다 압축률이 좋지만 애니메이션은 지원하지 않음

# GIF
![](https://i.imgur.com/09zPrlk.png)


- 무손실 압축 포맷
- 1px이 8bits(인덱스 컬러)의 색상 표현 가능 (2^8)
  - PNG는 RGB 채널에 별도로 알파 채널이 있지만 GIF는 RGB 채널 안에서 알파값을 조정하는 것만 가능함
- 애니메이션 지원
- **움직이는 애니메이션(움짤) 저장 용도에 적합**

# 부록
### 개발자가 알아서 좋을게 있을까?
**그렇다.** 프론트엔드 개발자 관점에서 생각해보자. 이미지는 웹페이지 로딩 시간에 영향을 주는 요소 중 하나이다. 만약 디자이너가 JPG로 줘야할 이미지를 PNG로 줬다면? 압축 효율에서 패배했기 때문에 로딩 시간이 증가할 것이다. 스웨덴의 웹사이트 모니터링 기관 핑덤에 의하면 첫 페이지 로딩시간이 3초가 넘으면 이탈률이 크게 증가했다고 한다 (3초 이탈률 9% -> 5초 38%) (주목할 것은 조사 기관이 스웨덴이라는 점이다.). 우리는 이 사실을 디자이너에게 어필하여 포맷에 맞는 이미지를 받아낼 수 있어야 한다. 

우리 회사에서 서비스하던 앱 중에 스플래시 이미지 용량을 30MB 짜리를 썼다가 아마존 서버 비용이 몇천만원이 나왔던 적이 있다. 백엔드 개발자가 어드민 페이지에서 용량 제한을 미리 걸어두었다면 예방할 수 있지 않았을까? 사용자가 파일을 업로드 할 때 어떤 포맷을 허용할 건지, 용량 제한은 어떻게 둘건지 개발자는 합리적으로 결정할 수 있어야 한다. '포맷? 음.. `jpg, png, gif`면 되겠지' 라고 단순하게 생각할 수도 있다. 만약 `webp`를 알았다면 저장소 보관 비용과 트래픽 비용을 더 줄일수도 있었을 것이다. 참고로 `webp`는 `GIF`를 개선한 이미지 포맷으로 `GIF`에 비해 최대 30%정도 적은 용량으로 업로드가 가능하다.

### mozjpeg
> MozJPEG improves JPEG compression efficiency achieving higher visual quality and smaller file sizes at the same time. It is compatible with the JPEG standard, and the vast majority of the world's deployed JPEG decoders.

[mozjpeg 깃허브](https://github.com/mozilla/mozjpeg)에서 말하길, mozjpeg는 JPEG 이미지 품질과 압축 효율성을 향상시킨 JPEG 인코더라고 한다. 직접 빌드해서 쓸 수도 있고 [https://mozjpeg.com/](https://mozjpeg.com/ "mozjpeg online encoder") 사이트를 이용하는 방법도 있다.

[webp와 jpeg를 비교한 글](https://siipo.la/blog/is-webp-really-better-than-jpeg#:~:text=WebP%20seems%20to%20have%20about,compression%20is%20equal%20or%20worse. "webp vs jpeg")이 있는데, 500px 이하의 작은 이미지는 `webp`가 더 압축 효율이 좋았던 반면 500px 보다 큰 이미지는 `mozjpeg`의 압축 효율이 더 좋다고 한다.
