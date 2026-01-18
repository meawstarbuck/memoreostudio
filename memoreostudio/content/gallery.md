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
  <button onclick="filterImages('family')" class="btn-filter" style="background: #f4f4f4; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin: 5px;">Family</button>
</div>

<div id="portfolio-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
  
  <div class="portfolio-item solo">
    <img src="/images/christmas_market_1.jpg" style="width:100%; height: 350px; object-fit: cover; border-radius:10px;">
  </div>
  <div class="portfolio-item solo">
    <img src="/images/christmas_market_2.jpg" style="width:100%; height: 350px; object-fit: cover; border-radius:10px;">
  </div>
  <div class="portfolio-item solo">
    <img src="/images/christmas_market_3.jpg" style="width:100%; height: 350px; object-fit: cover; border-radius:10px;">
  </div>

  <div class="portfolio-item graduation">
    <img src="/images/Graduation.jpg" style="width:100%; height: 350px; object-fit: cover; border-radius:10px;">
  </div>
  
  <div class="portfolio-item couple">
    <img src="/images/wedding.jpg" style="width:100%; height: 350px; object-fit: cover; border-radius:10px;">
  </div>

  <div class="portfolio-item family">
    <img src="/images/family.jpg" style="width:100%; height: 350px; object-fit: cover; border-radius:10px;">
  </div>
  
</div>

<script>
function filterImages(category) {
  const items = document.getElementsByClassName('portfolio-item');
  const buttons = document.getElementsByClassName('btn-filter');
  
  // จัดการการแสดงผลรูปภาพ
  if (category === 'all') {
    for (let item of items) { item.style.display = 'block'; }
  } else {
    for (let item of items) {
      item.style.display = item.classList.contains(category) ? 'block' : 'none';
    }
  }

  // เพิ่มลูกเล่น: เปลี่ยนสีปุ่มที่ถูกเลือก (Optional)
  for (let btn of buttons) {
    btn.style.background = '#f4f4f4';
    btn.style.color = 'black';
  }
  event.currentTarget.style.background = '#333';
  event.currentTarget.style.color = 'white';
}
</script>