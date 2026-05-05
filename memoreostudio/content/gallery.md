---
title: "My Portfolio"
date: 2022-06-25T18:35:46+05:30
draft: false
description: "Capture the feeling, keep the memory. With Memoreo. London-based Portrait & Lifestyle Photographer"
layout: "gallery"
galleryImages:
viewer : true
viewerOptions : {
    title: false
    # you can add more options here. refer https://github.com/fengyuanchen/viewerjs?tab=readme-ov-file#options
}
---

### Portfolio

<div style="text-align: center; margin-bottom: 30px;">
  <button onclick="filterImages('all')" class="btn-filter" style="background: #333; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin: 5px;">All</button>
  <button onclick="filterImages('solo')" class="btn-filter" style="background: #f4f4f4; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin: 5px;">Solo & Lifestyle</button>
  <button onclick="filterImages('graduation')" class="btn-filter" style="background: #f4f4f4; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin: 5px;">Graduation</button>
  <button onclick="filterImages('couple')" class="btn-filter" style="background: #f4f4f4; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin: 5px;">Couple & Wedding</button>
   <button onclick="filterImages('party')" class="btn-filter" style="background: #f4f4f4; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin: 5px;">Party & Event</button>
</div>

{{< gallery-data >}}


<script>
function filterImages(category) {
  const items = document.getElementsByClassName('portfolio-item');
  const buttons = document.getElementsByClassName('btn-filter');
  
  // แสดง/ซ่อน รูปตามหมวดหมู่
  for (let item of items) {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  }

  // เปลี่ยนสีปุ่มที่กดให้เด่นขึ้น
  for (let btn of buttons) {
    btn.style.background = '#f4f4f4';
    btn.style.color = 'black';
  }
  event.currentTarget.style.background = '#333';
  event.currentTarget.style.color = 'white';
}
</script>