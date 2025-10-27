// Animación de checks en la sección de servicios (sección 4)
function animateServiceChecks() {
  const section = document.getElementById('section-4');
  if (!section) return;
  const items = section.querySelectorAll('.service-item .check-path');
  let animated = false;
  function triggerAnimation() {
    if (animated) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      items.forEach((el, i) => {
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 0.7,
          delay: i * 0.18,
          ease: 'power2.out'
        });
        // Añadir clase checked al contenedor para estilos
        el.closest('.service-check').classList.add('checked');
      });
      animated = true;
      window.removeEventListener('scroll', triggerAnimation);
    }
  }
  // Inicializar estado (oculto)
  items.forEach(el => {
    gsap.set(el, { strokeDashoffset: 24 });
    el.closest('.service-check').classList.remove('checked');
  });
  window.addEventListener('scroll', triggerAnimation);
  // Por si ya está visible al cargar
  triggerAnimation();
}
import gsap from "gsap";
import Observer from "gsap/Observer"; // <- no curly braces, Observer is default export
import ScrollSmoother from "gsap/ScrollSmoother";
gsap.registerPlugin(Observer, ScrollSmoother);
let
    lastScrollTop = 0,
    index = 0
;

// Animación de scroll
function scrollAnimation() {
    const 
        sections = document.querySelectorAll('.animate'),
        scrollPosition = window.scrollY || document.documentElement.scrollTop,
        windowHeight = window.innerHeight
    ;

    if (scrollPosition > lastScrollTop) {
        sections.forEach(section => {
            const 
                sectionTop = section.offsetTop,
                sectionHeight = section.offsetHeight;

            if (
                scrollPosition + windowHeight >= sectionTop + sectionHeight / 4
            ) {
                section.classList.remove('none');
                section.classList.add('animate__animated');
                section.classList.add('animate__fadeInDown');
            }
        });
    }

    lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition
}

// Funcionalidad del formulario
function initializeForm() {
    console.log('Inicializando formulario...');
    const form = document.getElementById('quotationForm');
    
    if (form) {
        // Verificar si ya se inicializó
        if (form.hasAttribute('data-initialized')) {
            console.log('Formulario ya estaba inicializado');
            return;
        }
        
        console.log('Formulario encontrado, agregando event listener...');
        form.addEventListener('submit', function(e) {
            console.log('Formulario enviado!');
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('Datos del formulario:', data);
            
            // Validar datos
            if (!validateForm(data)) {
                console.log('Validación fallida');
                return;
            }
            
            console.log('Validación exitosa, mostrando opciones...');
            // Mostrar opciones al usuario
            sendToWhatsApp(data);
        });
        
        // Marcar como inicializado
        form.setAttribute('data-initialized', 'true');
        console.log('Formulario inicializado correctamente');
    } else {
        console.error('Formulario no encontrado! Verificar ID "quotationForm"');
    }
}

// Validar formulario
function validateForm(data) {
    console.log('Validando formulario con datos:', data);
    const requiredFields = ['nombre', 'email', 'telefono', 'origen', 'destino', 'tipo_vivienda', 'fecha_mudanza', 'descripcion'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            console.log(`Campo faltante: ${field}`);
            alert(`Por favor completa el campo: ${getFieldLabel(field)}`);
            return false;
        }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Por favor ingresa un email válido');
        return false;
    }
    
    console.log('Validación completada exitosamente');
    return true;
}

// Obtener etiquetas amigables para los campos
function getFieldLabel(field) {
    const labels = {
        'nombre': 'Nombre Completo',
        'email': 'Correo Electrónico',
        'telefono': 'Teléfono',
        'origen': 'Dirección de Origen',
        'destino': 'Dirección de Destino',
        'tipo_vivienda': 'Tipo de Vivienda',
        'fecha_mudanza': 'Fecha de Mudanza',
        'descripcion': 'Descripción'
    };
    return labels[field] || field;
}

// Mostrar opciones de envío
function showSubmissionOptions(data) {
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¿Cómo prefieres enviar tu cotización?</h3>
            <div class="modal-buttons">
                <button data-action="whatsapp" class="btn-whatsapp">
                    📱 Enviar por WhatsApp
                </button>
                <button data-action="email" class="btn-email">
                    📧 Enviar por Email
                </button>
                <button data-action="local" class="btn-save">
                    💾 Guardar Localmente
                </button>
                <button data-action="close" class="btn-close">❌ Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar event listeners a los botones del modal
    modal.addEventListener('click', function(e) {
        const action = e.target.getAttribute('data-action');
        
        switch(action) {
            case 'whatsapp':
                sendToWhatsApp(data);
                break;
            case 'email':
                sendToEmail(data);
                break;
            case 'local':
                saveToLocalStorage(data);
                break;
            case 'close':
                closeModal();
                break;
        }
    });
}

// Enviar a WhatsApp
function sendToWhatsApp(data) {
    const phoneNumber = "573112508193"; // Número de Colombia ya configurado
    const message = `🚛 *Nueva Cotización - Mudanzas Elite JP*

👤 *Cliente:* ${data.nombre}
📧 *Email:* ${data.email}
📱 *Teléfono:* ${data.telefono}

📍 *Desde:* ${data.origen}
📍 *Hacia:* ${data.destino}
🏠 *Tipo de vivienda:* ${data.tipo_vivienda}
📅 *Fecha preferida:* ${data.fecha_mudanza}

📝 *Detalles:*
${data.descripcion}

_Enviado desde: mudanzaselitejp.com_`;
    
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en una nueva pestaña
    const newWindow = window.open(whatsappURL, '_blank');
    
    // Verificar si se abrió correctamente
    if (newWindow) {
        showSuccessMessage('WhatsApp');
        closeModal();
    } else {
        // Si no se puede abrir automáticamente, mostrar el enlace
        alert('¡Casi listo! Haz clic en "OK" y se abrirá WhatsApp');
        window.location.href = whatsappURL;
        showSuccessMessage('WhatsApp');
        closeModal();
    }
}

// Enviar por Email
function sendToEmail(data) {
    const email = "info@mudanzaselitejp.com"; // Email del negocio
    const subject = `Nueva Cotización - ${data.nombre}`;
    const body = `
Estimado equipo,

Ha llegado una nueva solicitud de cotización:

DATOS DEL CLIENTE:
- Nombre: ${data.nombre}
- Email: ${data.email}
- Teléfono: ${data.telefono}

DETALLES DE LA MUDANZA:
- Origen: ${data.origen}
- Destino: ${data.destino}
- Tipo de vivienda: ${data.tipo_vivienda}
- Fecha preferida: ${data.fecha_mudanza}

DESCRIPCIÓN:
${data.descripcion}

Saludos,
Sistema Web Mudanzas Elite JP
    `;
    
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoURL;
    
    showSuccessMessage('Email');
    closeModal();
}

// Guardar en localStorage (para luego exportar)
function saveToLocalStorage(data) {
    const quotes = JSON.parse(localStorage.getItem('mudanzas_quotes') || '[]');
    const newQuote = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    quotes.push(newQuote);
    localStorage.setItem('mudanzas_quotes', JSON.stringify(quotes));
    
    showSuccessMessage('Local');
    closeModal();
    
    // Mostrar opción de descargar
    setTimeout(() => {
        if (confirm('¿Quieres descargar las cotizaciones guardadas en Excel?')) {
            downloadQuotesAsCSV();
        }
    }, 1000);
}

// Descargar cotizaciones como CSV
function downloadQuotesAsCSV() {
    const quotes = JSON.parse(localStorage.getItem('mudanzas_quotes') || '[]');
    if (quotes.length === 0) {
        alert('No hay cotizaciones guardadas');
        return;
    }
    
    const headers = ['ID', 'Fecha', 'Nombre', 'Email', 'Teléfono', 'Origen', 'Destino', 'Tipo Vivienda', 'Fecha Mudanza', 'Descripción'];
    const csvContent = [
        headers.join(','),
        ...quotes.map(quote => [
            quote.id,
            new Date(quote.timestamp).toLocaleDateString(),
            quote.nombre,
            quote.email,
            quote.telefono,
            quote.origen,
            quote.destino,
            quote.tipo_vivienda,
            quote.fecha_mudanza,
            `"${quote.descripcion.replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizaciones_mudanzas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Funciones auxiliares
function showSuccessMessage(method) {
    const message = {
        'WhatsApp': '¡Cotización enviada por WhatsApp! Te contactaremos pronto.',
        'Email': '¡Email preparado! Se abrirá tu cliente de correo.',
        'Local': '¡Cotización guardada! Podrás descargarla después.'
    };
    
    alert(message[method]);
    document.getElementById('quotationForm').reset();
}

function closeModal() {
    const modal = document.querySelector('.submission-modal');
    if (modal) {
        modal.remove();
    }
}

// Smooth scroll para los enlaces
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, inicializando...');
  initializeForm();
  initializeSmoothScroll();
  // Inicializar thumbnails dinámicos después de que se cargue GSAP
  setTimeout(() => {
    initializeThumbnails();
  }, 100);
  // Inicializar navegación y modales (Misión / Visión)
  initNavModals();
  // Inicializar animación de checks de servicios
  animateServiceChecks();
});

// También inicializar cuando la ventana se cargue completamente
window.addEventListener('load', function() {
    console.log('Ventana cargada completamente');
    // Re-inicializar si es necesario
    if (!document.getElementById('quotationForm').hasAttribute('data-initialized')) {
        initializeForm();
    }
});

document.addEventListener('scroll', () => {
    scrollAnimation();
});



const wrapper = document.querySelector(".wrapper");
const boxes = gsap.utils.toArray(".card");
const thumbnails = gsap.utils.toArray("li", document.querySelector(".thumbnails"));
let activeElement;
let previousElement;
let nextElement;

const loop = horizontalLoop(boxes, {
  paused: true, 
  speed: 0.5,
  draggable: true, // make it draggable
  center: true, // active element is the one in the center of the container rather than th left edge
  onChange: (element, index) => { // when the active element changes, this function gets called.
//remove classes from elements that won't get called anytime soon.
activeElement && activeElement.classList.remove("active");
previousElement && previousElement.querySelector("img").classList.remove("previous-element");
nextElement && nextElement.querySelector("img").classList.remove("next-element");
activeElement && activeElement.querySelector("img").classList.remove("active-element");
element.classList.add("active");
    activeElement = element;
    
//define previous and next card elements
if (index === 0) {
    previousElement = boxes[boxes.length - 1];
    nextElement = boxes[1];
  } else if (index === boxes.length - 1) {
    previousElement = boxes[index - 1];
    nextElement = boxes[boxes.length - boxes.length];
  } else {
    previousElement = boxes[index - 1];
    nextElement = boxes[index + 1];
  }
    
//add classes to apply will-change through css
previousElement.querySelector("img").classList.add("previous-element");
nextElement.querySelector("img").classList.add("next-element");
element.querySelector("img").classList.add("active-element");
   
// animate active, previous and next elements
   gsap.to(activeElement.querySelector("img"), {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transformOrigin: "50% 50%",
    x: 0
  });
 gsap.to(previousElement.querySelector("img"), {
    opacity: 0.7,
    scale: 0.9,
    transformOrigin: "50% 50%",
    rotateY: -45,
    x: "7vh"
  });
 gsap.to(nextElement.querySelector("img"), {
    opacity: 0.7,
    scale: 0.9,
    transformOrigin: "50% 50%",
    rotateY: 45,
    x: "-7vh"
  });    
  
  // Actualizar thumbnail activo
  updateActiveThumbnail(index);
  }
});

boxes.forEach((box, i) => box.addEventListener("click", () => loop.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));

// Navegación con flechas (si existen en el DOM)
const btnRight = document.querySelector(".go-right");
const btnLeft = document.querySelector(".go-left");
if (btnRight) btnRight.addEventListener("click", () => loop.next({duration: 0.4, ease: "power1.inOut"}));
if (btnLeft) btnLeft.addEventListener("click", () => loop.previous({duration: 0.4, ease: "power1.inOut"}));

// Función para inicializar thumbnails dinámicamente
function initializeThumbnails() {
  const thumbnailsContainer = document.querySelector('.thumbnails');
  const cards = document.querySelectorAll('.card');
  
  // Limpiar thumbnails existentes
  thumbnailsContainer.innerHTML = '';
  
  // Crear thumbnails dinámicamente
  cards.forEach((card, index) => {
    const li = document.createElement('li');
    li.className = `go-${getIndexName(index)}`;
    li.setAttribute('data-index', index);
    
    const img = document.createElement('img');
    img.className = 'card-thumbnail';
    const cardImg = card.querySelector('img');
    img.src = cardImg.src;
    img.alt = cardImg.alt || `Imagen ${index + 1}`;
    
    li.appendChild(img);
    thumbnailsContainer.appendChild(li);
    
    // Agregar event listener
    li.addEventListener('click', () => {
      loop.toIndex(index, {duration: 0.4, ease: "power1.inOut"});
      updateActiveThumbnail(index);
    });
  });
}

// Función para obtener nombres de índice dinámicamente
function getIndexName(index) {
  const names = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 
                 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 
                 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  return names[index] || `item-${index + 1}`;
}

// Función para actualizar thumbnail activo
function updateActiveThumbnail(activeIndex) {
  const thumbnails = document.querySelectorAll('.thumbnails li');
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === activeIndex);
  });
}

/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Features:
 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
 - When each item animates to the left or right enough, it will loop back to the other side
 - Optionally pass in a config object with values like draggable: true, center: true, speed (default: 1, which travels at roughly 100 pixels per second), paused (boolean), repeat, reversed, and paddingRight.
 - The returned timeline will have the following methods added to it:
   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
   - times - an Array of the times on the timeline where each element hits the "starting" spot.
 */
function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let onChange = config.onChange,
    lastIndex = 0,
    tl = gsap.timeline({repeat: config.repeat, onUpdate: onChange && function() {
        let i = tl.closestIndex();
        if (lastIndex !== i) {
          lastIndex = i;
          onChange(items[i], i);
        }
      }, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    spaceBefore = [],
    xPercents = [],
    curIndex = 0,
    indexIsDirty = false,
    center = config.center,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    timeOffset = 0,
    container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
    totalWidth,
    getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + spaceBefore[0] + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
    populateWidths = () => {
      let b1 = container.getBoundingClientRect(), b2;
      items.forEach((el, i) => {
        widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
        xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
        b2 = el.getBoundingClientRect();
        spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
        b1 = b2;
      });
      gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: i => xPercents[i]
      });
      totalWidth = getTotalWidth();
    },
    timeWrap,
    populateOffsets = () => {
      timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
      center && times.forEach((t, i) => {
        times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
      });
    },
    getClosest = (values, value, wrap) => {
      let i = values.length,
        closest = 1e10,
        index = 0, d;
      while (i--) {
        d = Math.abs(values[i] - value);
        if (d > wrap / 2) {
          d = wrap - d;
        }
        if (d < closest) {
          closest = d;
          index = i;
        }
      }
      return index;
    },
    populateTimeline = () => {
      let i, item, curX, distanceToStart, distanceToLoop;
      tl.clear();
      for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
          .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }
      timeWrap = gsap.utils.wrap(0, tl.duration());
    },
    refresh = (deep) => {
      let progress = tl.progress();
      tl.progress(0, true);
      populateWidths();
      deep && populateTimeline();
      populateOffsets();
      deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
    },
    proxy;
  gsap.set(items, {x: 0});
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener("resize", () => refresh(true));
  function toIndex(index, vars) {
    vars = vars || {};
    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex && index !== curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = {time: timeWrap};
    }
    curIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(proxy);    
    return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
  }
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.closestIndex = setCurrent => {
    let index = getClosest(times, tl.time(), tl.duration());
    if (setCurrent) {
      curIndex = index;
      indexIsDirty = false;
    }
    return index;
  };
  tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
  tl.next = vars => toIndex(tl.current()+1, vars);
  tl.previous = vars => toIndex(tl.current()-1, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  if (config.draggable && typeof(Draggable) === "function") {
    proxy = document.createElement("div")
    let wrap = gsap.utils.wrap(0, 1),
      ratio, startProgress, draggable, dragSnap, lastSnap, initChangeX, wasPlaying,
      align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
      syncIndex = () => tl.closestIndex(true);
    typeof(InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club");
    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: "x",
      onPressInit() {
        let x = this.x;
        gsap.killTweensOf(tl);
        wasPlaying = !tl.paused();
        tl.pause();
        startProgress = tl.progress();
        refresh();
        ratio = 1 / totalWidth;
        initChangeX = (startProgress / -ratio) - x;
        gsap.set(proxy, {x: startProgress / -ratio});
      },
      onDrag: align,
      onThrowUpdate: align,
      overshootTolerance: 0,
      inertia: true,
      snap(value) {
        //note: if the user presses and releases in the middle of a throw, due to the sudden correction of proxy.x in the onPressInit(), the velocity could be very large, throwing off the snap. So sense that condition and adjust for it. We also need to set overshootTolerance to 0 to prevent the inertia from causing it to shoot past and come back
        if (Math.abs(startProgress / -ratio - this.x) < 10) {
          return lastSnap + initChangeX
        }
        let time = -(value * ratio) * tl.duration(),
          wrappedTime = timeWrap(time),
          snapTime = times[getClosest(times, wrappedTime, tl.duration())],
          dif = snapTime - wrappedTime;
        Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
        lastSnap = (time + dif) / tl.duration() / -ratio;
        return lastSnap;
      },
      onRelease() {
        syncIndex();
        draggable.isThrowing && (indexIsDirty = true);
      },
      onThrowComplete: () => {
        syncIndex();
        wasPlaying && tl.play();
      }
    })[0];
    tl.draggable = draggable;
  }
  tl.closestIndex(true);
  lastIndex = curIndex;
  onChange && onChange(items[curIndex], curIndex);
  return tl;
}


// ---------- Navbar & Modales (Misión / Visión) ----------
function initNavModals() {
  const linkMision = document.getElementById('link-mision');
  const linkVision = document.getElementById('link-vision');
  const modalMision = document.getElementById('modal-mision');
  const modalVision = document.getElementById('modal-vision');

  const openModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
  };
  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
  };

  if (linkMision && modalMision) {
    linkMision.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalMision);
    });
  }
  if (linkVision && modalVision) {
    linkVision.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalVision);
    });
  }

  // Delegación para cerrar por botón X y click en overlay
  [modalMision, modalVision].forEach((modal) => {
    if (!modal) return;
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
  });

  // Cerrar con tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [modalMision, modalVision].forEach((m) => m && m.classList.contains('is-open') && m.classList.remove('is-open'));
    }
  });
}

