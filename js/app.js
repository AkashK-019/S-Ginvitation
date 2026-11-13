(function (window, document) {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var guest = params.get('guest') || params.get('to') || params.get('name');
  if (guest) {
    var cleanGuest = decodeURIComponent(guest).trim();
    var personalizedBadge = document.getElementById('personalizedBadge');
    if (personalizedBadge) {
      personalizedBadge.textContent = cleanGuest + ' यांच्यासाठी सस्नेह निमंत्रण';
      personalizedBadge.style.display = 'inline-block';
    }
  }

  var mainScroller = document.getElementById('mainScroller');
  var pinnedStage = document.getElementById('pinnedStage');
  var stageCover = document.getElementById('stageCover');
  var stageLanding = document.getElementById('stageLanding');
  var sectionInvitation = document.getElementById('sectionInvitation');
  var invitationReel = document.getElementById('invitationReel');
  var invitationCrest = document.getElementById('invitationCrest');

  var cueToSection2 = document.getElementById('cueToSection2');
  var cueToSection3 = document.getElementById('cueToSection3');

  var enterBtnText = document.getElementById('enterBtnText');
  if (enterBtnText) {
    enterBtnText.textContent = 'निमंत्रण उघडण्यासाठी क्लिक करा';
  }

  var invocationText = document.getElementById('invocationText');
  var shlokaBox = document.getElementById('shlokaBox');
  var shlokaLine1 = document.getElementById('shlokaLine1');
  var shlokaLine2 = document.getElementById('shlokaLine2');
  var typeCursor = document.getElementById('typeCursor');

  var weddingMusic = document.getElementById('weddingMusic');

  // Music will be initialized on first user gesture to preserve initial loading speed

  var coverDateSection = document.getElementById('coverDateSection');
  var isCoverRevealed = false;

  function revealCoverDate() {
    if (coverDateSection) {
      coverDateSection.classList.add('is-revealed');
    }
  }

  function revealCoverSection() {
    if (isCoverRevealed || !stageCover) return;
    isCoverRevealed = true;

    setTimeout(function () {
      stageCover.classList.add('is-revealed');
      if (cueToSection2) {
        cueToSection2.classList.add('is-revealed');
      }

      if (stageCover) {
        var content = stageCover.querySelector('.cover-content');
        if (content) {
          content.style.clipPath = 'none';
          content.style.webkitClipPath = 'none';
        }
      }

      setTimeout(revealCoverDate, 280);
    }, 30);
  }

  function waitForCoverAssetsAndFonts() {
    var promises = [];

    if (document.fonts && document.fonts.load) {
      promises.push(
        Promise.all([
          document.fonts.load('800 1.5rem "Noto Serif Devanagari"', '॥ शुभविवाह निमंत्रण ॥').catch(function () {}),
          document.fonts.load('600 1.1rem "Noto Serif Devanagari"', 'आयुष्याच्या नव्या पर्वाला सुरुवात करताना, आपल्या स्नेहपूर्ण उपस्थितीने व शुभाशीर्वादांनी हा मंगल सोहळा अधिक संस्मरणीय करावा, ही नम्र विनंती. ०५ · १२ · २०२६').catch(function () {}),
          document.fonts.load('700 1.2rem "Noto Serif Devanagari"', '॥ श्री गणेशाय नमः ॥').catch(function () {}),
          document.fonts.load('700 1rem "Cinzel"').catch(function () {}),
          document.fonts.load('600 1rem "Cinzel"').catch(function () {}),
          document.fonts.load('italic 500 1rem "Cormorant Garamond"').catch(function () {})
        ]).then(function () {
          return document.fonts.ready;
        }).catch(function () {})
      );
    }

    promises.push(new Promise(function (resolve) {
      var bgImg = new Image();
      bgImg.onload = resolve;
      bgImg.onerror = resolve;
      bgImg.src = 'https://ik.imagekit.io/greenspire/invitation/main-bg.avif';
      if (bgImg.complete) resolve();
    }));

        promises.push(new Promise(function (resolve) {
      var calImg = new Image();
      if (calImg.complete) { resolve(); return; }
      calImg.onload = resolve;
      calImg.onerror = resolve;
      calImg.src = 'assets/couple-calligraphy.webp?v=19';
      if (calImg.complete) { resolve(); }
    }));

    Promise.all(promises).then(revealCoverSection).catch(revealCoverSection);

    setTimeout(revealCoverSection, 400);
  }

  waitForCoverAssetsAndFonts();

  var progressBar = document.getElementById('progressBar');
  var progressIndicator = document.getElementById('progressIndicator');

  var musicToggleBtn = document.getElementById('musicToggleBtn');

  var VOLUME = 0.55;
  var fadeTimer = null;
  var musicStarted = false;
  var musicStarting = false;
  var userMuted = false;
  var audioUnlocked = false;
  var shouldPlayMusic = false;

  function fadeTo(target, ms, done) {
    window.clearInterval(fadeTimer);
    if (!weddingMusic) return;
    if (!ms || ms <= 0) {
      weddingMusic.volume = target;
      if (done) done();
      return;
    }
    var from = weddingMusic.volume;
    var start = Date.now();
    fadeTimer = window.setInterval(function () {
      if (!weddingMusic) {
        window.clearInterval(fadeTimer);
        return;
      }
      var elapsed = Date.now() - start;
      var t = Math.min(1, elapsed / ms);
      weddingMusic.volume = Math.max(0, Math.min(1, from + (target - from) * t));
      if (t >= 1) {
        window.clearInterval(fadeTimer);
        weddingMusic.volume = target;
        if (done) done();
      }
    }, 30);
  }

  function setMusicButtonState(muted) {
    if (!musicToggleBtn) return;
    musicToggleBtn.classList.toggle('muted', !!muted);
    musicToggleBtn.setAttribute('aria-label', muted ? 'संगीत चालू करा' : 'संगीत बंद करा');
  }

  setMusicButtonState(false);

  if (weddingMusic) {
    weddingMusic.addEventListener('playing', function () {
      if (shouldPlayMusic && !userMuted) {
        musicStarted = true;
        setMusicButtonState(false);
      }
    });
    weddingMusic.addEventListener('pause', function () {
      if (userMuted) {
        setMusicButtonState(true);
      }
    });
  }

  function unlockAudioOnFirstTouch() {
    if (audioUnlocked || !weddingMusic || musicStarted || userMuted) return;

    if (shouldPlayMusic) {
      startMusic();
      return;
    }

    weddingMusic.volume = 0;
    var p = weddingMusic.play();
    if (p !== undefined && p.then) {
      p.then(function () {
        audioUnlocked = true;
        if (shouldPlayMusic && !userMuted) {
          musicStarted = true;
          fadeTo(VOLUME, 900);
          setMusicButtonState(false);
        } else {
          weddingMusic.volume = 0;
        }
      }).catch(function () {
        audioUnlocked = false;
      });
    }
  }

  function startMusic() {
    shouldPlayMusic = true;
    if (!weddingMusic || userMuted) return;

    setMusicButtonState(false);

    if (musicStarted) {
      if (weddingMusic.paused) {
        weddingMusic.play().catch(function () {});
      }
      if (weddingMusic.volume < VOLUME) {
        fadeTo(VOLUME, 800);
      }
      return;
    }

    if (!weddingMusic.paused) {
      audioUnlocked = true;
      musicStarted = true;
      musicStarting = false;
      fadeTo(VOLUME, 900);
      setMusicButtonState(false);
      return;
    }

    if (musicStarting) return;
    musicStarting = true;

    weddingMusic.volume = 0;
    var p = weddingMusic.play();
    if (p !== undefined && p.then) {
      p.then(function () {
        audioUnlocked = true;
        musicStarted = true;
        musicStarting = false;
        fadeTo(VOLUME, 900);
        setMusicButtonState(false);
      }).catch(function () {
        musicStarted = false;
        musicStarting = false;
      });
    } else {
      musicStarted = true;
      musicStarting = false;
      weddingMusic.volume = VOLUME;
      setMusicButtonState(false);
    }
  }

  if (musicToggleBtn && weddingMusic) {
    musicToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();

      if (userMuted || weddingMusic.paused) {
        userMuted = false;
        shouldPlayMusic = true;
        setMusicButtonState(false);
        weddingMusic.volume = VOLUME;
        var p = weddingMusic.play();
        if (p && p.then) {
          p.then(function () {
            musicStarted = true;
            audioUnlocked = true;
          }).catch(function () {
            setMusicButtonState(true);
          });
        } else {
          musicStarted = true;
          audioUnlocked = true;
        }
      } else {
        userMuted = true;
        musicStarted = false;
        setMusicButtonState(true);
        fadeTo(0, 250, function () {
          weddingMusic.pause();
        });
      }
    });
  }

  function onUserActivationGesture(e) {
    if (musicToggleBtn && e && e.target && (e.target === musicToggleBtn || musicToggleBtn.contains(e.target))) {
      return;
    }
    if (userMuted) return;
    if (shouldPlayMusic) {
      if (weddingMusic && (weddingMusic.paused || weddingMusic.volume < 0.05)) {
        startMusic();
      }
    } else if (!audioUnlocked) {
      unlockAudioOnFirstTouch();
    }
  }

  ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, onUserActivationGesture, { passive: true, capture: true });
  });

  var INVOCATION = '॥ श्री गणेशाय नमः ॥';
  var SHLOKA_1 = 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।';
  var SHLOKA_2 = 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥';
  var typewriterStarted = false;

  if (invocationText) {
    invocationText.textContent = INVOCATION;
  }

  function getGraphemes(text) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      var seg = new Intl.Segmenter('hi', { granularity: 'grapheme' });
      return Array.from(seg.segment(text), function (s) { return s.segment; });
    }
    return Array.from(text);
  }

  function startTypewriterSequence() {
    if (typewriterStarted) return;
    typewriterStarted = true;

    if (stageCover) {
      stageCover.style.opacity = '0';
      stageCover.style.pointerEvents = 'none';
      stageCover.style.display = 'none';
      stageCover.style.visibility = 'hidden';
      stageCover.classList.add('is-hidden');
    }
    if (cueToSection2) {
      cueToSection2.classList.add('is-hidden');
      cueToSection2.classList.remove('is-revealed');
      cueToSection2.style.display = 'none';
      cueToSection2.style.visibility = 'hidden';
      cueToSection2.style.opacity = '0';
      cueToSection2.style.pointerEvents = 'none';
    }

    var chars1 = getGraphemes(SHLOKA_1);
    var chars2 = getGraphemes(SHLOKA_2);

    var idx1 = 0;
    var idx2 = 0;
    var speed = 40;

    if (shlokaLine1) shlokaLine1.textContent = '';
    if (shlokaLine2) shlokaLine2.textContent = '';
    
    if (typeCursor) {
      typeCursor.style.display = 'none';
      typeCursor.classList.remove('is-typing');
      typeCursor.classList.remove('done');
      if (shlokaLine1) {
        shlokaLine1.appendChild(typeCursor);
      }
    }

    function typeLine1() {
      if (typeCursor && !typeCursor.classList.contains('is-typing')) {
        typeCursor.style.display = '';
        typeCursor.classList.add('is-typing');
      }
      if (idx1 < chars1.length) {
        var ch = chars1[idx1++];
        if (typeCursor && typeCursor.parentNode === shlokaLine1) {
          shlokaLine1.insertBefore(document.createTextNode(ch), typeCursor);
        } else if (shlokaLine1) {
          shlokaLine1.textContent += ch;
        }
        setTimeout(typeLine1, speed);
      } else {
        setTimeout(function () {
          if (typeCursor && shlokaLine2) {
            shlokaLine2.appendChild(typeCursor);
          }
          setTimeout(typeLine2, 220);
        }, 220);
      }
    }

    function typeLine2() {
      if (idx2 < chars2.length) {
        var ch = chars2[idx2++];
        if (typeCursor && typeCursor.parentNode === shlokaLine2) {
          shlokaLine2.insertBefore(document.createTextNode(ch), typeCursor);
        } else if (shlokaLine2) {
          shlokaLine2.textContent += ch;
        }
        setTimeout(typeLine2, speed);
      } else {
        setTimeout(function () {
          if (typeCursor) {
            typeCursor.classList.remove('is-typing');
            typeCursor.classList.add('done');
            typeCursor.style.display = 'none';
          }
        }, 1200);
      }
    }

    setTimeout(typeLine1, 350);
  }

  var minAllowedTop = 0;
  var isAutoScrolling = false;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(element, targetY, duration, callback) {
    if (!element) return;
    var startY = element.scrollTop;
    var diff = targetY - startY;
    if (Math.abs(diff) < 2) {
      element.scrollTop = targetY;
      if (callback) callback();
      return;
    }
    isAutoScrolling = true;
    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var elapsed = currentTime - startTime;
      var progress = Math.min(1, elapsed / duration);
      var eased = easeInOutCubic(progress);
      element.scrollTop = startY + diff * eased;

      renderScrollState();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.scrollTop = targetY;
        isAutoScrolling = false;
        renderScrollState();
        if (callback) callback();
      }
    }

    requestAnimationFrame(step);
  }

  var section2UnlockedAt = 0;

  function advanceToSection(targetSec) {
    if (!mainScroller || isAutoScrolling) return;
    var h = mainScroller.clientHeight || window.innerHeight;
    var targetTop = (targetSec - 1) * h;
    
    var isMobile = window.innerWidth <= 600;
    var duration = targetSec === 2 ? (isMobile ? 1400 : 1350) : (isMobile ? 1200 : 1050); 

    if (targetSec === 2) {
      if (cueToSection2) {
        cueToSection2.classList.add('is-hidden');
        cueToSection2.classList.remove('is-revealed');
        cueToSection2.style.display = 'none';
        cueToSection2.style.visibility = 'hidden';
        cueToSection2.style.opacity = '0';
        cueToSection2.style.pointerEvents = 'none';
      }
      section2UnlockedAt = Date.now() + duration + 200;
      startMusic();
    }

    smoothScrollTo(mainScroller, targetTop, duration, function () {
      if (targetSec === 2) {
        minAllowedTop = h;
        section2UnlockedAt = Date.now() + 200;
        if (musicToggleBtn) musicToggleBtn.classList.add('is-active');
        startMusic();
        if (cueToSection2) {
          cueToSection2.classList.add('is-hidden');
          cueToSection2.classList.remove('is-revealed');
          cueToSection2.style.display = 'none';
          cueToSection2.style.visibility = 'hidden';
          cueToSection2.style.opacity = '0';
          cueToSection2.style.pointerEvents = 'none';
        }
        if (stageCover) {
          stageCover.style.opacity = '0';
          stageCover.style.pointerEvents = 'none';
          stageCover.style.display = 'none';
          stageCover.style.visibility = 'hidden';
          stageCover.classList.add('is-hidden');
        }
        if (stageLanding) {
          stageLanding.style.opacity = '1';
          stageLanding.style.pointerEvents = 'auto';
          stageLanding.style.transform = 'none';
          stageLanding.style.clipPath = 'none';
        }
        setTimeout(function () {
          startTypewriterSequence();
        }, 220);
      } else if (targetSec === 3) {
        minAllowedTop = h * 2;
        if (musicToggleBtn) musicToggleBtn.classList.add('is-active');
        startMusic();
        if (sectionInvitation) {
          sectionInvitation.style.opacity = '1';
          sectionInvitation.style.clipPath = 'none';
          sectionInvitation.style.webkitClipPath = 'none';
          sectionInvitation.style.pointerEvents = 'auto';
          sectionInvitation.style.transform = 'none';
        }
        if (invitationReel) {
          invitationReel.scrollTop = 0;
        }
      }
    });
  }

  if (cueToSection2) {
    var hasBegun = false;
    function triggerBegin(e) {
      if (hasBegun) return;
      hasBegun = true;
      if (e) {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
      }
      if (cueToSection2) {
        cueToSection2.classList.add('is-hidden');
        cueToSection2.classList.remove('is-revealed');
        cueToSection2.style.display = 'none';
        cueToSection2.style.visibility = 'hidden';
        cueToSection2.style.opacity = '0';
        cueToSection2.style.pointerEvents = 'none';
      }
      startMusic();
      advanceToSection(2);
    }

    cueToSection2.addEventListener('click', triggerBegin);
    cueToSection2.addEventListener('touchend', triggerBegin);
    cueToSection2.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerBegin(e);
      }
    });
  }

  if (stageCover) {
    stageCover.addEventListener('click', function (e) {
      if (minAllowedTop === 0) {
        startMusic();
        advanceToSection(2);
      }
    });
  }

  if (cueToSection3 && mainScroller) {
    cueToSection3.addEventListener('click', function (e) {
      e.stopPropagation();
      advanceToSection(3);
    });
    cueToSection3.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceToSection(3);
      }
    });
  }

  var touchStartY = 0;
  var touchStartSection = 1;
  if (mainScroller) {
    mainScroller.addEventListener('touchstart', function (e) {
      unlockAudioOnFirstTouch();
      if (e.touches && e.touches.length) {
        touchStartY = e.touches[0].clientY;
        var h = mainScroller ? mainScroller.clientHeight : 0;
        touchStartSection = (h > 0) ? Math.round(mainScroller.scrollTop / h) + 1 : 1;
      }
    }, { passive: true });

    mainScroller.addEventListener('touchmove', function (e) {
      if (!e.touches || !e.touches.length) return;
      var curY = e.touches[0].clientY;
      var deltaY = curY - touchStartY;
      var h = mainScroller ? mainScroller.clientHeight : 0;

      if (h > 0 && minAllowedTop >= h * 2) {
        return;
      }

      if (deltaY > 0 && mainScroller.scrollTop <= minAllowedTop + 1) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (minAllowedTop === 0) {
        if (e.cancelable) e.preventDefault();
        return;
      } else if (touchStartSection === 2 && h > 0 && minAllowedTop === h) {
        if (deltaY < -6) {
          if (e.cancelable) e.preventDefault();
          if (!isAutoScrolling && Date.now() >= section2UnlockedAt) {
            advanceToSection(3);
          }
          return;
        } else if (deltaY > 0) {
          if (e.cancelable) e.preventDefault();
          return;
        }
      }
    }, { passive: false });

    mainScroller.addEventListener('touchend', function () {
      if (shouldPlayMusic && !userMuted) {
        startMusic();
      }

      var h = mainScroller ? mainScroller.clientHeight : 0;
      if (h > 0 && minAllowedTop === h && !isAutoScrolling && Date.now() >= section2UnlockedAt) {
        if (mainScroller.scrollTop > h + 4) {
          advanceToSection(3);
        }
      }
    }, { passive: true });
  }

  function onWheelAction(e) {
    var delta = e.deltaY;
    var h = mainScroller ? mainScroller.clientHeight : 0;

    if (h > 0 && minAllowedTop >= h * 2) {
      if (!invitationReel) return;
      if (invitationReel.contains(e.target)) {
        return;
      }
      var step = delta;
      if (e.deltaMode === 1) step *= 16;
      else if (e.deltaMode === 2) step *= invitationReel.clientHeight;
      invitationReel.scrollTop += step;
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (delta < 0 && mainScroller && mainScroller.scrollTop <= minAllowedTop + 1) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (isAutoScrolling) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (minAllowedTop === 0) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (h > 0 && minAllowedTop === h) {
      if (delta > 0) {
        if (e.cancelable) e.preventDefault();
        if (!isAutoScrolling && Date.now() >= section2UnlockedAt) {
          advanceToSection(3);
        }
        return;
      }
    }
  }

  window.addEventListener('wheel', onWheelAction, { passive: false });

  window.addEventListener('keydown', function (e) {
    var h = mainScroller ? mainScroller.clientHeight : 0;

    if (h > 0 && minAllowedTop >= h * 2 && invitationReel) {
      var page = invitationReel.clientHeight * 0.82;
      if (e.key === 'ArrowDown') { invitationReel.scrollTop += 64; e.preventDefault(); }
      else if (e.key === 'ArrowUp') { invitationReel.scrollTop -= 64; e.preventDefault(); }
      else if (e.key === 'PageDown' || e.key === ' ') { invitationReel.scrollTop += page; e.preventDefault(); }
      else if (e.key === 'PageUp') { invitationReel.scrollTop -= page; e.preventDefault(); }
      else if (e.key === 'Home') { invitationReel.scrollTop = 0; e.preventDefault(); }
      else if (e.key === 'End') { invitationReel.scrollTop = invitationReel.scrollHeight; e.preventDefault(); }
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (minAllowedTop === 0) {
        e.preventDefault();
        return;
      } else if (h > 0 && minAllowedTop === h) {
        e.preventDefault();
        if (!isAutoScrolling && Date.now() >= section2UnlockedAt) {
          advanceToSection(3);
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (mainScroller && mainScroller.scrollTop <= minAllowedTop + 1) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  var ticking = false;

  function renderScrollState() {
    if (!mainScroller) return;
    var h = mainScroller.clientHeight;
    if (h <= 0) return;
    var top = mainScroller.scrollTop;

    if (top < minAllowedTop) {
      mainScroller.scrollTop = minAllowedTop;
      top = minAllowedTop;
    }

    if (minAllowedTop === 0 && !isAutoScrolling && top > 0) {
      mainScroller.scrollTop = 0;
      top = 0;
    }

    if (minAllowedTop === h && top > h + 5 && !isAutoScrolling && Date.now() >= section2UnlockedAt) {
      advanceToSection(3);
      return;
    }

    if (top <= h) {
      var p = Math.min(1, Math.max(0, top / h));

      if (sectionInvitation) {
        sectionInvitation.style.opacity = '0';
        sectionInvitation.style.pointerEvents = 'none';
        sectionInvitation.style.clipPath = 'inset(0 0 100% 0)';
        sectionInvitation.style.webkitClipPath = 'inset(0 0 100% 0)';
      }

      if (pinnedStage) {
        pinnedStage.style.transform = 'translateY(0)';
        pinnedStage.style.opacity = '1';
        pinnedStage.style.pointerEvents = 'none';
      }

      if (cueToSection2) {
        if (minAllowedTop >= h || p >= 0.08) {
          cueToSection2.classList.add('is-hidden');
          cueToSection2.classList.remove('is-revealed');
          cueToSection2.style.opacity = '0';
          cueToSection2.style.display = 'none';
          cueToSection2.style.visibility = 'hidden';
          cueToSection2.style.pointerEvents = 'none';
        } else {
          var cueOp1 = Math.max(0, 1 - p * 6);
          cueToSection2.classList.remove('is-hidden');
          cueToSection2.style.opacity = cueOp1.toFixed(3);
          cueToSection2.style.pointerEvents = cueOp1 > 0.5 ? 'auto' : 'none';
          cueToSection2.style.display = cueOp1 > 0.05 ? 'inline-flex' : 'none';
          cueToSection2.style.visibility = cueOp1 > 0.05 ? 'visible' : 'hidden';
        }
      }

      if (p <= 0.40) {
        var pCover = p / 0.40;
        var wipeCover = (pCover * 100).toFixed(2);

        stageCover.style.display = 'flex';
        stageCover.style.visibility = 'visible';
        stageCover.classList.remove('is-hidden');
        stageCover.style.opacity = Math.max(0, 1 - pCover).toFixed(3);
        stageCover.style.clipPath = 'inset(0 0 ' + wipeCover + '% 0)';
        stageCover.style.webkitClipPath = 'inset(0 0 ' + wipeCover + '% 0)';
        stageCover.style.transform = 'none';
        stageCover.style.pointerEvents = 'none';

        stageLanding.style.opacity = '0';
        stageLanding.style.pointerEvents = 'none';
        stageLanding.style.clipPath = 'inset(0 0 100% 0)';
        stageLanding.style.webkitClipPath = 'inset(0 0 100% 0)';

      } else if (p > 0.40 && p <= 0.48) {
        stageCover.style.opacity = '0';
        stageCover.style.pointerEvents = 'none';
        stageCover.style.display = 'none';
        stageCover.style.visibility = 'hidden';
        stageCover.classList.add('is-hidden');

        stageLanding.style.opacity = '0';
        stageLanding.style.pointerEvents = 'none';
        stageLanding.style.clipPath = 'inset(0 0 100% 0)';
        stageLanding.style.webkitClipPath = 'inset(0 0 100% 0)';

      } else {
        stageCover.style.opacity = '0';
        stageCover.style.pointerEvents = 'none';
        stageCover.style.display = 'none';
        stageCover.style.visibility = 'hidden';
        stageCover.classList.add('is-hidden');

        var pLanding = (p - 0.48) / 0.52;
        var wipeLanding = ((1 - pLanding) * 100).toFixed(2);

        stageLanding.style.opacity = pLanding.toFixed(3);
        stageLanding.style.clipPath = 'inset(0 0 ' + wipeLanding + '% 0)';
        stageLanding.style.webkitClipPath = 'inset(0 0 ' + wipeLanding + '% 0)';
        stageLanding.style.transform = 'translateZ(0)';
        stageLanding.style.pointerEvents = pLanding > 0.85 ? 'auto' : 'none';
      }

      if (p >= 0.99) {
        if (stageCover) {
          stageCover.style.opacity = '0';
          stageCover.style.pointerEvents = 'none';
          stageCover.style.display = 'none';
          stageCover.style.visibility = 'hidden';
          stageCover.classList.add('is-hidden');
        }
        stageLanding.style.opacity = '1';
        stageLanding.style.clipPath = 'none';
        stageLanding.style.webkitClipPath = 'none';
        stageLanding.style.pointerEvents = 'auto';
        stageLanding.style.transform = 'none';
      }

      if (cueToSection3) {
        var cueOp2 = p > 0.90 ? Math.min(1, (p - 0.90) * 10) : 0;
        cueToSection3.style.opacity = cueOp2.toFixed(3);
        cueToSection3.style.pointerEvents = cueOp2 > 0.5 ? 'auto' : 'none';
      }

      if (musicToggleBtn) {
        if (p >= 0.15 || minAllowedTop >= h) {
          musicToggleBtn.classList.add('is-active');
          if (!musicStarted && !userMuted) {
            startMusic();
          }
        } else if (minAllowedTop === 0 && p < 0.10) {
          musicToggleBtn.classList.remove('is-active');
        }
      }

      if (p >= 0.995 && !typewriterStarted) {
        startTypewriterSequence();
      }

    } else {
      var p2 = Math.min(1, Math.max(0, (top - h) / h));

      if (cueToSection2) {
        cueToSection2.classList.add('is-hidden');
        cueToSection2.classList.remove('is-revealed');
        cueToSection2.style.display = 'none';
        cueToSection2.style.visibility = 'hidden';
        cueToSection2.style.opacity = '0';
        cueToSection2.style.pointerEvents = 'none';
      }

      if (stageCover) {
        stageCover.style.opacity = '0';
        stageCover.style.pointerEvents = 'none';
        stageCover.style.display = 'none';
        stageCover.style.visibility = 'hidden';
        stageCover.classList.add('is-hidden');
      }

      if (pinnedStage) {
        pinnedStage.style.transform = 'translateY(0)';
        pinnedStage.style.opacity = '1';
        pinnedStage.style.pointerEvents = 'none';
      }

      if (cueToSection3) {
        var cueOp3 = Math.max(0, 1 - p2 * 4);
        cueToSection3.style.opacity = cueOp3.toFixed(3);
        cueToSection3.style.pointerEvents = 'none';
      }

      if (p2 <= 0.45) {
        var pOut = p2 / 0.45;
        var wipeOut = (pOut * 100).toFixed(2);
        stageLanding.style.opacity = Math.max(0, 1 - pOut).toFixed(3);
        stageLanding.style.clipPath = 'inset(0 0 ' + wipeOut + '% 0)';
        stageLanding.style.webkitClipPath = 'inset(0 0 ' + wipeOut + '% 0)';
        stageLanding.style.transform = 'none';
        stageLanding.style.pointerEvents = 'none';
      } else {
        stageLanding.style.opacity = '0';
        stageLanding.style.pointerEvents = 'none';
        stageLanding.style.clipPath = 'inset(0 0 100% 0)';
        stageLanding.style.webkitClipPath = 'inset(0 0 100% 0)';
      }

      if (p2 >= 0.10) {
        var pIn = Math.min(1, (p2 - 0.10) / 0.90);
        var wipeIn = ((1 - pIn) * 100).toFixed(2);
        if (sectionInvitation) {
          sectionInvitation.style.opacity = pIn.toFixed(3);
          sectionInvitation.style.clipPath = 'inset(0 0 ' + wipeIn + '% 0)';
          sectionInvitation.style.webkitClipPath = 'inset(0 0 ' + wipeIn + '% 0)';
          sectionInvitation.style.transform = 'translateZ(0)';
          sectionInvitation.style.pointerEvents = pIn > 0.85 ? 'auto' : 'none';
        }
      } else {
        if (sectionInvitation) {
          sectionInvitation.style.opacity = '0';
          sectionInvitation.style.pointerEvents = 'none';
          sectionInvitation.style.clipPath = 'inset(0 0 100% 0)';
          sectionInvitation.style.webkitClipPath = 'inset(0 0 100% 0)';
        }
      }

      if (p2 >= 0.98) {
        if (sectionInvitation) {
          sectionInvitation.style.opacity = '1';
          sectionInvitation.style.clipPath = 'none';
          sectionInvitation.style.webkitClipPath = 'none';
          sectionInvitation.style.pointerEvents = 'auto';
          sectionInvitation.style.transform = 'none';
        }
      }
    }
  }

  function onMainScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        renderScrollState();
        ticking = false;
      });
      ticking = true;
    }
  }

  if (mainScroller) {
    mainScroller.addEventListener('scroll', onMainScroll, { passive: true });
    renderScrollState();
  }

  var shrinkElements = null;

  function updateProgress() {
    if (!invitationReel || !progressIndicator) return;
    var max = invitationReel.scrollHeight - invitationReel.clientHeight;
    var ratio = max > 0 ? invitationReel.scrollTop / max : 0;
    progressIndicator.style.height = (ratio * 100).toFixed(1) + '%';

    var cueSection3Scroll = document.getElementById('cueSection3Scroll');
    if (cueSection3Scroll) {
      if (invitationReel.scrollTop > 18) {
        cueSection3Scroll.classList.add('is-hidden');
      } else {
        cueSection3Scroll.classList.remove('is-hidden');
      }
    }

    if (!shrinkElements) {
      shrinkElements = invitationReel.querySelectorAll(
        '.invitation-crest, .hero-eyebrow, .hero-names, .hero-line, .ceremony-title, ' +
        '.divider-royal, .divider-starlet, .family, .panel-title, .reception-meta-box, ' +
        '.venue-address-box, .venue-map-frame, ' +
        '.closing-warm, .closing-signature'
      );
    }

    var reelH = invitationReel.clientHeight;
    if (reelH <= 0 || !shrinkElements.length) return;
    var reelRect = invitationReel.getBoundingClientRect();
    var fadeThreshold = reelH * 0.25;

    for (var i = 0; i < shrinkElements.length; i++) {
      var el = shrinkElements[i];
      var rect = el.getBoundingClientRect();
      var elTop = rect.top - reelRect.top;

      if (elTop < fadeThreshold) {
        var p = (fadeThreshold - elTop) / (fadeThreshold * 0.88);
        if (p < 0) p = 0;
        if (p > 1) p = 1;

        var scale = 1 - 0.12 * p;
        var shift = -6 * p;
        el.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';
      } else {
        if (el.style.transform) {
          el.style.transform = '';
        }
      }
    }
  }

  var reelTicking = false;
  function onReelScroll() {
    if (!reelTicking) {
      reelTicking = true;
      requestAnimationFrame(function () {
        updateProgress();
        reelTicking = false;
      });
    }
  }

  if (invitationReel) {
    invitationReel.addEventListener('scroll', onReelScroll, { passive: true });
    window.addEventListener('resize', function () {
      updateProgress();
    }, { passive: true });
  }

  var cueSection3Scroll = document.getElementById('cueSection3Scroll');
  if (cueSection3Scroll && invitationReel) {
    cueSection3Scroll.addEventListener('click', function () {
      invitationReel.scrollBy({ top: 220, behavior: 'smooth' });
    });
  }

})(window, document);