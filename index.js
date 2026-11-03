import * as THREE from 'three';

/* ============================================================
   3D HERO SCENE (only runs on pages that have #hero3d)
   ============================================================ */
const container = document.getElementById('hero3d');
if (container) {
  try { initScene(); } catch (e) { console.warn('3D scene failed:', e); fallback(); }
}

function fallback() {
  const img = document.createElement('img');
  img.src = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80';
  img.alt = 'Ice cream';
  img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
  container.appendChild(img);
}

function initScene() {
  const testCanvas = document.createElement('canvas');
  const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
  if (!gl) { fallback(); return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 6.4);
  camera.lookAt(0, 0.6, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);

  const iceCream = new THREE.Group();
  iceCream.position.y = 0.1;
  scene.add(iceCream);

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.92, 2.0, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xC9A876, roughness: 0.85, metalness: 0.05, side: THREE.DoubleSide })
  );
  cone.rotation.x = Math.PI;
  cone.position.y = -0.95;
  iceCream.add(cone);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.94, 0.92, 0.12, 32),
    new THREE.MeshStandardMaterial({ color: 0xB08B58, roughness: 0.8 })
  );
  rim.position.y = -0.06;
  iceCream.add(rim);

  const scoopMat = (c, r = 0.55) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0.02 });

  const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 48), scoopMat(0x7A2D3C));
  s1.position.y = 0.42; s1.scale.set(1, 0.96, 1); iceCream.add(s1);

  const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 48, 48), scoopMat(0xC2964A));
  s2.position.set(0.05, 1.28, 0.02); s2.scale.set(1, 0.95, 1); iceCream.add(s2);

  const s3 = new THREE.Mesh(new THREE.SphereGeometry(0.66, 48, 48), scoopMat(0xF5EBD5));
  s3.position.set(-0.04, 2.05, 0); s3.scale.set(1, 0.94, 1); iceCream.add(s3);

  const cherry = new THREE.Mesh(
    new THREE.SphereGeometry(0.23, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x5E2130, roughness: 0.28, metalness: 0.3 })
  );
  cherry.position.set(0.02, 2.62, 0);
  iceCream.add(cherry);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.3, 8),
    new THREE.MeshStandardMaterial({ color: 0x5A7F4E, roughness: 0.7 })
  );
  stem.position.set(0.1, 2.82, 0);
  stem.rotation.z = -0.45;
  iceCream.add(stem);

  const sprinkleColors = [0x7A2D3C, 0xC2964A, 0x6E8068, 0xF5EBD5, 0xA87E38, 0xE4C4A0];
  const sprinkleMats = sprinkleColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }));

  function addSprinkles(cy, radius, count) {
    for (let i = 0; i < count; i++) {
      const geo = new THREE.CylinderGeometry(0.023, 0.023, 0.09, 6);
      const sp = new THREE.Mesh(geo, sprinkleMats[Math.floor(Math.random() * sprinkleMats.length)]);
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(0.15 + Math.random() * 0.75);
      sp.position.set(
        Math.sin(theta) * Math.cos(phi) * radius,
        cy + Math.cos(theta) * radius * 0.95,
        Math.sin(theta) * Math.sin(phi) * radius
      );
      sp.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      iceCream.add(sp);
    }
  }
  addSprinkles(2.05, 0.66, 14);
  addSprinkles(1.28, 0.80, 16);
  addSprinkles(0.42, 0.90, 12);

  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xF6ECD7, 0.85); fill.position.set(-4, 2.5, 3); scene.add(fill);
  const rimL = new THREE.PointLight(0x7A2D3C, 1.1, 12); rimL.position.set(0, 3, -4); scene.add(rimL);
  const warm = new THREE.PointLight(0xFFE0B0, 0.9, 10); warm.position.set(2, 1, 3); scene.add(warm);

  const particleColors = [0x7A2D3C, 0xC2964A, 0x6E8068, 0xF5EBD5, 0xE4C4A0];
  const particleCount = window.innerWidth < 768 ? 12 : 22;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const r = 0.04 + Math.random() * 0.13;
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(r, 12, 12),
      new THREE.MeshStandardMaterial({
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        roughness: 0.65, transparent: true, opacity: 0.7
      })
    );
    p.position.set((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5 - 2);
    p.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.4,
      baseY: p.position.y,
      spinX: (Math.random() - 0.5) * 0.4,
      spinY: (Math.random() - 0.5) * 0.4
    };
    particles.push(p);
    scene.add(p);
  }

  let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });
  container.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
  container.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      const rect = container.getBoundingClientRect();
      targetX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
    }
  }, { passive: true });

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;

    iceCream.rotation.y = t * 0.35 + mouseX * 0.5;
    iceCream.rotation.x = mouseY * 0.15;
    iceCream.position.y = 0.1 + Math.sin(t * 1.3) * 0.07;

    camera.position.x = mouseX * 0.9;
    camera.position.y = 0.4 - mouseY * 0.35;
    camera.lookAt(0, 0.65, 0);

    particles.forEach(p => {
      p.position.y = p.userData.baseY + Math.sin(t * p.userData.speed + p.userData.phase) * 0.35;
      p.rotation.x = t * p.userData.spinX;
      p.rotation.y = t * p.userData.spinY;
    });

    renderer.render(scene, camera);
  }
  requestAnimationFrame(() => { resize(); animate(); });
}

/* ============================================================
   APP LOGIC (runs on every page — all elements are guarded)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ACTIVE NAV LINK ---------- */
  const currentPage = document.body.dataset.page || 'home';
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === currentPage);
  });

  /* ---------- FLAVORS DATA ---------- */
  const FLAVORS = [
    { name:'Vanilla Bean', price:'$6.00', desc:'Madagascar vanilla, split by hand, steeped 24 hours.', cats:['classic'], tags:[{label:'Classic'}], img:'https://assets-dam.foodthinkers.com/HO1WTJM3/at/xfvmt6b835pp7sm4b5wmwjvr/vanilla-bean-ice-cream__hero-image.jpg' },
    { name:'Dark Chocolate', price:'$6.00', desc:'Single-origin Ecuadorian chocolate, bittersweet and rich.', cats:['classic'], tags:[{label:'Intense',cls:'tag--accent'}], img:'https://cdn.aboutamom.com/uploads/2025/03/a-chocolate_ice_cream_recipe-feature-4.jpeg' },
    { name:'Salted Caramel', price:'$6.00', desc:'Burnt sugar, cultured cream, Maldon flake.', cats:['classic'], tags:[{label:'Fan Fave',cls:'tag--gold'}], badge:{text:'Best Seller',cls:'hot'}, img:'https://cupcakesandcouscous.com/wp-content/uploads/2017/03/d1311-salted2bcaramel2bice2bcream2b72bof2b7.jpg' },
    { name:'Cookies & Cream', price:'$6.00', desc:'Crushed chocolate sandwich cookies, vanilla cream base.', cats:['classic'], tags:[{label:'Classic'}], img:'https://www.pbfingers.com/wp-content/uploads/2020/12/b1fdee19-dda3-4c65-902b-02e8d863aca8-1541bf82-2701-4200-b689-949bfc1f1acc.jpg' },
    { name:'Pistachio Gelato', price:'$6.50', desc:'Bronte pistachios, stone-ground, dense and nutty.', cats:['classic'], tags:[{label:'Gelato'},{label:'Organic',cls:'tag--gold'}], badge:{text:'Signature',cls:'gold'}, img:'https://www.greenpan.us/cdn/shop/articles/GP_FrostPro_Licorice_Gelato_Final_03-5293x4457-dc826d3.jpg?v=1778880848' },
    { name:'Coffee', price:'$6.00', desc:'Cold-brew concentrate, dark roast, a hint of cocoa.', cats:['classic'], tags:[{label:'Classic'}], img:'https://joythebaker.com/wp-content/uploads/2023/08/NoChurchCoffeeIceCream-28.jpg' },
    { name:'Strawberry', price:'$5.50', desc:'Local strawberries, folded through a cream base.', cats:['classic','fruit'], tags:[{label:'Seasonal'}], img:'https://www.mydiasporakitchen.com/wp-content/uploads/2020/02/savingpng-3-24.png' },
    { name:'Mint Chip', price:'$6.00', desc:'Fresh mint steeped in cream, dark chocolate shards.', cats:['classic'], tags:[{label:'Classic'}], img:'https://bakerstable.net/wp-content/uploads/2023/03/no-cook-mint-chocolate-chip-ice-cream-15-e1678315622631.jpg' },
    { name:'Strawberry Basil', price:'$5.50', desc:'Sun-ripened strawberries, fresh basil, lemon zest.', cats:['fruit','sorbet','vegan'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Sorbet'}], badge:{text:'Best Seller',cls:'hot'}, img:'https://adventuresinfoodieland.com/wp-content/uploads/2023/08/roasted-strawberry-basil-lime-ice-cream-15-2-1.jpg' },
    { name:'Raspberry Ripple', price:'$6.00', desc:'Raspberry coulis swirled through vanilla cream.', cats:['fruit','seasonal'], tags:[{label:'Seasonal'}], img:'https://digitalcontent.api.tesco.com/v2/media/realfood/6a3e449a-bb94-40a2-ae9f-5545638bde91/1400x919_Chocolate-%26-raspberry-ripple-ice-cream.jpeg' },
    { name:'Peach & Cream', price:'$5.50', desc:'Ripe peaches, vanilla bean, a splash of bourbon.', cats:['fruit','seasonal'], tags:[{label:'Seasonal'}], img:'https://bakerstable.net/wp-content/uploads/2022/07/peaches-and-cream-ice-cream-2022-24-e1657373531582.jpg' },
    { name:'Fig & Honey', price:'$6.50', desc:'Black mission figs, wildflower honey, mascarpone.', cats:['fruit','seasonal'], tags:[{label:'Seasonal'}], badge:{text:'New',cls:'new'}, img:'https://thesaltycooker.com/wp-content/uploads/2023/11/HoneyFigPistachioIceCream-BLOG-scaled.jpg' },
    { name:'Charred Strawberry', price:'$6.50', desc:'Wood-fired strawberries, black pepper, crème fraîche.', cats:['fruit','seasonal'], tags:[{label:'Seasonal'}], img:'https://www.cooking-therapy.com/wp-content/uploads/2019/05/Chocolate-Strawberry-Ice-Cream-5.jpg' },
    { name:'Mango Sorbet', price:'$5.50', desc:'Alphonso mangoes, lime, a pinch of sea salt.', cats:['sorbet','vegan','fruit'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Sorbet'}], img:'https://hips.hearstapps.com/hmg-prod/images/mango-sorbet-3252-669e6bff5de91.jpg?crop=0.502xw:1.00xh;0.444xw,0&resize=1200:*' },
    { name:'Lemon Sorbet', price:'$5.50', desc:'Amalfi lemons, a whisper of basil, bright and clean.', cats:['sorbet','vegan'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Sorbet'}], img:'https://cdn.prod.website-files.com/62ed4f60c674b0415c0f4ff5/634d9dff2249c5729a7f40ce_SL_2022_0831_Lemon-Sorbet_rgb.jpg' },
    { name:'Blood Orange', price:'$5.50', desc:'Sicilian blood oranges, a whisper of rosemary.', cats:['sorbet','vegan'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Sorbet'}], img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPihslBx4QHv53-jUkaD8J_mNT1nSq6I3Ucqhji9XL-H1vFnBlOLXGW39s&s=10' },
    { name:'Passion Fruit', price:'$5.50', desc:'Tart passion fruit, mango, toasted coconut flake.', cats:['sorbet','vegan','fruit'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Sorbet'}], img:'https://images.getrecipekit.com/v1609731420_PassionFruitSorbet_520x400_zji65y.jpg?width=650&quality=90&' },
    { name:'Raspberry Sorbet', price:'$5.50', desc:'Raspberries, lemon juice, just enough sugar.', cats:['sorbet','vegan','fruit'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Sorbet'}], img:'https://icecreamfromscratch.com/wp-content/uploads/2023/05/Raspberry-Sherbet-1.2-720x720.jpg' },
    { name:'Coconut Chocolate', price:'$6.00', desc:'Coconut milk base, 70% dark chocolate, toasted flakes.', cats:['vegan'], tags:[{label:'Vegan',cls:'tag--sage'},{label:'Rich',cls:'tag--accent'}], img:'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=800&q=80' },
    { name:'Cashew Vanilla', price:'$6.50', desc:'Soaked cashews, vanilla bean, maple. Creamy and clean.', cats:['vegan'], tags:[{label:'Vegan',cls:'tag--sage'}], img:'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80' },
    { name:'Almond Fudge', price:'$6.50', desc:'Almond milk, cocoa, fudge ripple, toasted almonds.', cats:['vegan'], tags:[{label:'Vegan',cls:'tag--sage'}], img:'https://www.saltandserenity.com/wp-content/uploads/2020/08/3-scoops-in-bowl-683x1024.jpg' },
    { name:'Oat Milk Brown Sugar', price:'$6.50', desc:'Oat milk, dark muscovado, a pinch of cinnamon.', cats:['vegan'], tags:[{label:'Vegan',cls:'tag--sage'}], badge:{text:'New',cls:'new'}, img:'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=800&q=80' },
    { name:'Coconut Mango', price:'$6.00', desc:'Coconut cream, Alphonso mango, lime zest.', cats:['vegan','fruit'], tags:[{label:'Vegan',cls:'tag--sage'}], img:'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80' },
    { name:'Honey Lavender', price:'$6.50', desc:'Wildflower honey, culinary lavender, cream finish.', cats:['seasonal'], tags:[{label:'Floral',cls:'tag--accent'}], img:'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=800&q=80' },
    { name:'Matcha White Chocolate', price:'$6.50', desc:'Ceremonial matcha, white chocolate chunks, sea salt.', cats:['seasonal'], tags:[{label:'Matcha',cls:'tag--sage'}], badge:{text:'New',cls:'new'}, img:'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&w=800&q=80' },
    { name:'Rose Pistachio', price:'$6.50', desc:'Rose water, pistachio, candied rose petal.', cats:['seasonal'], tags:[{label:'Floral'}], img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80' },
    { name:'Black Sesame', price:'$6.50', desc:'Toasted black sesame, honey, a nutty, savory finish.', cats:['seasonal'], tags:[{label:'Adventurous'}], img:'https://img.taste.com.au/F3ukRzjU/taste/2016/11/black-sesame-ice-cream-cones-100224-1.jpeg' },
    { name:'Burnt Honey', price:'$7.00', desc:'Caramelized honey, cultured cream, sea salt.', cats:['premium'], tags:[{label:'Premium',cls:'tag--gold'}], img:'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80' },
    { name:'Espresso Crumble', price:'$7.00', desc:'Double espresso, cocoa nib crumble, cream.', cats:['premium'], tags:[{label:'Premium',cls:'tag--gold'}], img:'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80' },
    { name:'Earl Grey', price:'$6.50', desc:'Bergamot tea, honey, a hint of milk chocolate.', cats:['premium','seasonal'], tags:[{label:'Tea'}], img:'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80' },
    { name:'Ube', price:'$6.50', desc:'Purple yam, coconut milk, toasted coconut.', cats:['premium','seasonal'], tags:[{label:'Fruity',cls:'tag--accent'}], badge:{text:'New',cls:'new'}, img:'https://www.bigmoca.nl/photos/ube%20afogato.webp' },
    { name:'Thai Tea', price:'$6.50', desc:'Spiced black tea, sweetened condensed milk, cream.', cats:['premium'], tags:[{label:'Premium',cls:'tag--gold'}], img:'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80' },
  ];

  const GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1532678465554-948462a124bd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1633933358116-a27b902fad35?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1626200419189-2db2a4e9c4be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516043827471-b85a5f76a05b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1502301197179-65228ab57f78?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1587563974670-b5181a367c6e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516054475461-d2247306168b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1557031103-70cd1ac78f0e?auto=format&fit=crop&w=900&q=80',
  ];

  /* ---------- RENDER FLAVORS ---------- */
  function flavorCard(f) {
    const badgeClass = f.badge
      ? (f.badge.cls === 'hot' ? 'flavor-card__badge--hot'
        : f.badge.cls === 'new' ? 'flavor-card__badge--new'
        : 'flavor-card__badge--gold')
      : '';
    const badge = f.badge ? `<span class="flavor-card__badge ${badgeClass}">${f.badge.text}</span>` : '';
    const tags = f.tags.map(t => `<span class="tag ${t.cls || ''}">${t.label}</span>`).join('');
    return `
      <article class="flavor-card tilt" data-cat="${f.cats.join(' ')}">
        <div class="flavor-card__img">
          <img src="${f.img}" alt="${f.name}" loading="lazy">
          ${badge}
        </div>
        <div class="flavor-card__body">
          <div class="flavor-card__row">
            <h3>${f.name}</h3>
            <span class="flavor-card__price">${f.price}</span>
          </div>
          <p class="flavor-card__desc">${f.desc}</p>
          <div class="flavor-card__foot">
            <div class="flavor-card__tags">${tags}</div>
            <button class="add-btn" aria-label="Order ${f.name}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }

  const flavorGrid = document.getElementById('flavorGrid');
  if (flavorGrid) flavorGrid.innerHTML = FLAVORS.map(flavorCard).join('');

  /* ---------- RENDER GALLERY ---------- */
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = GALLERY_IMAGES.map((src, i) =>
      `<figure><img src="${src}" alt="Gallery image ${i + 1}" loading="lazy"></figure>`
    ).join('');
  }

  /* ---------- NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- REVEAL ---------- */
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  }
  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      if (io) io.observe(el); else el.classList.add('in');
    });
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) el.classList.add('in');
    });
  }

  /* ---------- COUNTERS ---------- */
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.done === '1') return;
      const target = parseInt(el.dataset.count, 10) || 0;
      if (target === 0) { el.textContent = '0'; return; }
      el.dataset.done = '1';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- TILT ---------- */
  function initTilt() {
    document.querySelectorAll('.tilt').forEach(card => {
      if (card.dataset.tiltBound === '1') return;
      card.dataset.tiltBound = '1';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- TRUST MARQUEE ---------- */
  const trustTrack = document.getElementById('trustTrack');
  if (trustTrack) trustTrack.innerHTML += trustTrack.innerHTML;

  /* ---------- FILTERS ---------- */
  const filters = document.getElementById('filters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('.menu-filter');
      if (!btn) return;
      filters.querySelectorAll('.menu-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      document.querySelectorAll('#flavorGrid .flavor-card').forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        const show = cat === 'all' || cats.includes(cat);
        card.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------- ADD TO ORDER ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (btn) { e.preventDefault(); showToast('Added to your order'); }
  });

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lbImg.src = src;
    lbImg.alt = alt || 'Gallery image';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', (e) => {
    const fig = e.target.closest('.masonry figure, .gallery-strip figure');
    if (!fig) return;
    const img = fig.querySelector('img');
    if (!img) return;
    openLightbox(img.src, img.alt);
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeLightbox(); closeNav(); } });

  /* ---------- TOAST ---------- */
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  }

  /* ---------- PHOTO UPLOAD ---------- */
  const photoInput = document.getElementById('photoInput');
  const uploadZone = document.getElementById('uploadZone');

  if (photoInput && uploadZone) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('Please choose an image file.');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image is too large (max 8 MB).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const figure = document.createElement('figure');
        figure.className = 'new';
        figure.innerHTML = `<img src="${ev.target.result}" alt="Customer photo" loading="lazy">`;
        galleryGrid.insertBefore(figure, galleryGrid.firstChild);
        showToast('Your photo is now in the gallery!');
        setTimeout(() => figure.classList.remove('new'), 3200);
      };
      reader.onerror = () => showToast('Could not read that file.');
      reader.readAsDataURL(file);
      photoInput.value = '';
    });

    ['dragenter','dragover'].forEach(ev => {
      uploadZone.addEventListener(ev, (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    });
    ['dragleave','drop'].forEach(ev => {
      uploadZone.addEventListener(ev, (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
    });
    uploadZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const figure = document.createElement('figure');
          figure.className = 'new';
          figure.innerHTML = `<img src="${ev.target.result}" alt="Customer photo" loading="lazy">`;
          galleryGrid.insertBefore(figure, galleryGrid.firstChild);
          showToast('Your photo is now in the gallery!');
          setTimeout(() => figure.classList.remove('new'), 3200);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* ---------- FORM VALIDATION ---------- */
  const emailRE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function validate(input) {
    const v = input.value.trim();
    let bad = false;
    if (input.type === 'email') bad = !emailRE.test(v);
    else if (input.type === 'tel') bad = !/^[\d\s()+.-]{7,20}$/.test(v);
    else if (input.type === 'date') bad = v === '';
    else if (input.tagName === 'SELECT') bad = v === '';
    else if (input.tagName === 'TEXTAREA') bad = v.length < 10;
    else bad = v.length < 2;
    input.closest('.field').classList.toggle('error', bad);
    return !bad;
  }

  function wireForm(form, onSubmit) {
    if (!form) return;
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));

    fields.forEach(el => {
      el.addEventListener('blur', () => {
        if (el.value.trim() || el.closest('.field').classList.contains('error')) validate(el);
      });
      el.addEventListener('input', () => {
        if (el.closest('.field').classList.contains('error')) validate(el);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      fields.forEach(el => { if (!validate(el)) ok = false; });

      if (!ok) {
        const bad = form.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (bad) bad.focus();
        showToast('Please check the highlighted fields.');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        const data = Object.fromEntries(new FormData(form).entries());
        form.reset();
        form.querySelectorAll('.field').forEach(f => f.classList.remove('error'));
        if (onSubmit) onSubmit(data);
      }, 750);
    });
  }

  wireForm(document.getElementById('contactForm'), () => {
    showToast('Message sent. We\'ll reply within one business day.');
  });

  const reviewGrid = document.getElementById('reviewGrid');
  wireForm(document.getElementById('reviewForm'), (data) => {
    const rating = parseInt(data.rating, 10) || 5;
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const name = (data.name || 'Guest').trim();
    const text = (data.review || '').trim();
    const initials = name.split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'G';

    const card = document.createElement('div');
    card.className = 'review-card new';
    card.innerHTML = `
      <div class="review-card__stars">${stars}</div>
      <blockquote class="review-card__quote">"${escapeHTML(text)}"</blockquote>
      <div class="review-card__author">
        <div class="review-card__avatar">${escapeHTML(initials)}</div>
        <div>
          <div class="review-card__name">${escapeHTML(name)}</div>
          <div class="review-card__meta">Just now · Verified visitor</div>
        </div>
      </div>
    `;
    reviewGrid.prepend(card);
    setTimeout(() => card.classList.remove('new'), 3600);
    showToast('Thanks for the review — it\'s live!');

    setTimeout(() => { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
  });

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (!emailRE.test(input.value.trim())) {
        showToast('Please enter a valid email address.');
        input.focus();
        return;
      }
      input.value = '';
      showToast('You\'re on the list. Welcome to the scoop club.');
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- BOOT ---------- */
  observeReveals();
  initCounters();
  initTilt();
  window.addEventListener('load', () => { observeReveals(); initCounters(); initTilt(); });

})();