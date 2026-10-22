/* Downloaded only after an explicit request to inspect an image. */
let dialog;
let sequence = 0;
export function openMedia(link) {
  const zh = document.documentElement.lang.startsWith('zh');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'media-viewer';
    dialog.setAttribute('aria-label', 'Image details / 图片细节');
    dialog.innerHTML = '<div class="media-viewer__bar"><button type="button" data-close>Close / 关闭</button><button type="button" data-zoom-out aria-label="Zoom out / 缩小">−</button><button type="button" data-fit>Fit / 适合窗口</button><button type="button" data-zoom-in aria-label="Zoom in / 放大">＋</button><a data-original target="_blank" rel="noopener">Open original / 打开原图</a></div><p role="status"></p><div class="media-viewer__canvas" tabindex="0"><img alt=""></div>';
    document.body.append(dialog);
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    let scale = 1;
    const zoom = value => {
      scale = Math.max(.25, Math.min(8, value));
      const image = dialog.querySelector('img');
      image.style.width = `${scale * 100}%`;
      image.style.maxHeight = scale === 1 ? '76vh' : 'none';
      image.style.objectFit = 'contain';
    };
    dialog.querySelector('[data-zoom-in]').onclick = () => zoom(scale * 1.5);
    dialog.querySelector('[data-zoom-out]').onclick = () => zoom(scale / 1.5);
    dialog.querySelector('[data-fit]').onclick = () => zoom(1);
    dialog.addEventListener('close', () => { sequence++; dialog.querySelector('img').removeAttribute('src'); });
  }
  const current = ++sequence;
  const image = dialog.querySelector('img');
  const status = dialog.querySelector('[role="status"]');
  const original = dialog.querySelector('[data-original]');
  original.href = link.dataset.mediaOriginal || link.href;
  const caption = link.querySelector('img')?.alt || link.dataset.mediaCaption || '';
  original.textContent = (zh ? '打开原图' : 'Open original') + (link.dataset.mediaSize ? ` · ${link.dataset.mediaSize}` : '');
  status.textContent = zh ? '正在加载高清图，可先看预览。' : 'Loading detail. The preview remains available.';
  image.alt = caption;
  image.src = link.querySelector('img')?.currentSrc || link.dataset.mediaPreview || '';
  dialog.querySelector('[data-fit]').click();
  if (!dialog.open) dialog.showModal();
  const detailed = new Image();
  detailed.onload = () => {
    if (sequence !== current || !dialog.open) return;
    image.src = link.href;
    status.textContent = caption;
  };
  detailed.onerror = () => {
    if (sequence !== current || !dialog.open) return;
    status.replaceChildren(document.createTextNode(zh ? '高清图暂未加载成功。' : 'Detail could not load. '));
    const retry = document.createElement('button');
    retry.textContent = zh ? '重试' : 'Retry';
    retry.onclick = () => openMedia(link);
    status.append(retry);
  };
  detailed.src = link.href;
}
