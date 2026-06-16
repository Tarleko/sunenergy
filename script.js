// -------------------- КАЛЬКУЛЯТОР ОКУПАЕМОСТИ (ФТ-1) --------------------
const calcBtn = document.getElementById('calc-btn');
const roofArea = document.getElementById('roof-area');
const regionSelect = document.getElementById('region');
const monthlyConsumption = document.getElementById('monthly-consumption');
const resultsDiv = document.getElementById('calc-results');

function calculatePayback() {
    const area = parseFloat(roofArea.value);
    const insolation = parseFloat(regionSelect.value);
    const consumption = parseFloat(monthlyConsumption.value);

    if (isNaN(area) || area <= 0) {
        resultsDiv.innerHTML = '<p class="error">❌ Укажите корректную площадь крыши (больше 0)</p>';
        return;
    }
    if (isNaN(consumption) || consumption <= 0) {
        resultsDiv.innerHTML = '<p class="error">❌ Укажите корректное среднемесячное потребление</p>';
        return;
    }

    // Коэффициент эффективности панелей 0.18, площадь под 1 кВт ~ 8 м²
    const maxPossiblePower = area / 8;
    const annualConsumption = consumption * 12;
    // Годовая выработка с 1 кВт в зависимости от инсоляции (упрощённая модель)
    const annualYieldPerKW = insolation * 365 * 0.18;
    let recommendedPower = annualConsumption / annualYieldPerKW;
    recommendedPower = Math.min(recommendedPower, maxPossiblePower);
    recommendedPower = Math.max(1, recommendedPower.toFixed(1));

    const annualGeneration = recommendedPower * annualYieldPerKW;
    const tariff = 6.0; // руб/кВт·ч
    const annualSavings = annualGeneration * tariff;
    const systemCost = recommendedPower * 65000; // 65 тыс руб за кВт
    const paybackYears = systemCost / annualSavings;

    resultsDiv.innerHTML = `
        <p><strong>✨ Рекомендуемая мощность:</strong> ${recommendedPower} кВт</p>
        <p><strong>📊 Годовая выработка:</strong> ${Math.round(annualGeneration)} кВт·ч</p>
        <p><strong>💰 Годовая экономия:</strong> ${Math.round(annualSavings)} руб</p>
        <p><strong>⏳ Ориентировочный срок окупаемости:</strong> ${paybackYears.toFixed(1)} лет</p>
        <small>*Расчёт приблизительный. Для точного проектирования обратитесь к инженерам.</small>
    `;
}

if (calcBtn) calcBtn.addEventListener('click', calculatePayback);

// -------------------- ПОРТФОЛИО (ФТ-3) --------------------
const portfolioData = [
    { id: 1, title: "Коттедж в Истре", type: "house", power: "8.5 кВт", generation: "9850 кВт·ч/год", saving: "59100 руб", date: "2025-02-15", desc: "Установка на крыше, полностью автономное питание + резерв.", img: "images/placeholder.png" },
    { id: 2, title: "ТЦ «Энергия» (Краснодар)", type: "business", power: "45 кВт", generation: "52000 кВт·ч/год", saving: "312000 руб", date: "2025-01-20", desc: "Бизнес-центр, экономия 40% на электроэнергии.", img: "images/placeholder.png" },
    { id: 3, title: "МКД ЖК «Солнечный»", type: "housing", power: "120 кВт", generation: "138000 кВт·ч/год", saving: "828000 руб", date: "2024-11-10", desc: "Общедомовые нужды, субсидия от города.", img: "images/placeholder.png" },
    { id: 4, title: "Частный дом в Ростове", type: "house", power: "6.2 кВт", generation: "7200 кВт·ч/год", saving: "43200 руб", date: "2025-03-01", desc: "Сетевой вариант с продажей излишков.", img: "images/placeholder.png" },
    { id: 5, title: "Офисный парк «Техно»", type: "business", power: "28 кВт", generation: "32400 кВт·ч/год", saving: "194400 руб", date: "2024-12-05", desc: "Зелёный тариф, полная окупаемость за 4 года.", img: "images/placeholder.png" },
    { id: 6, title: "Школа №7 (Воронеж)", type: "housing", power: "35 кВт", generation: "40100 кВт·ч/год", saving: "240600 руб", date: "2025-02-28", desc: "Бюджетный проект по энергосервисному контракту.", img: "images/placeholder.png" }
];

function renderPortfolio(filter = "all") {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;
    let filtered = filter === "all" ? portfolioData : portfolioData.filter(p => p.type === filter);
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date)); // новые сверху
    grid.innerHTML = filtered.map(item => `
        <div class="portfolio-card" data-id="${item.id}">
            <img src="${item.img}" alt="${item.title}" loading="lazy">
            <div class="portfolio-card-info">
                <h3>${item.title}</h3>
                <p><strong>Мощность:</strong> ${item.power}</p>
                <p><strong>Выработка:</strong> ${item.generation}</p>
                <p><strong>Экономия:</strong> ${item.saving}</p>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
    });
}

function openModal(id) {
    const item = portfolioData.find(p => p.id === id);
    if (!item) return;
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.img}" style="width:100%; border-radius:16px; margin:16px 0;">
        <p><strong>Тип:</strong> ${item.type === 'house' ? 'Частный дом' : item.type === 'business' ? 'Бизнес' : 'ЖКХ'}</p>
        <p><strong>Мощность:</strong> ${item.power}</p>
        <p><strong>Годовая выработка:</strong> ${item.generation}</p>
        <p><strong>Экономия в год:</strong> ${item.saving}</p>
        <p><strong>Описание:</strong> ${item.desc}</p>
    `;
    modal.style.display = "block";
}

if (document.getElementById('portfolio-grid')) {
    renderPortfolio();
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPortfolio(btn.dataset.filter);
        });
    });
}

// закрытие модалки
const modal = document.getElementById('modal');
if (modal) {
    window.onclick = function(e) { if (e.target == modal) modal.style.display = "none"; };
    document.querySelector('.close-modal')?.addEventListener('click', () => modal.style.display = "none");
}

// -------------------- ФОРМЫ ОБРАТНОЙ СВЯЗИ (ФТ-4, имитация) --------------------
function handleFormSubmit(formId, successMsg = "Спасибо! Заявка принята. Мы свяжемся с вами.") {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('[name="name"]')?.value.trim();
        const phone = form.querySelector('[name="phone"]')?.value.trim();
        const email = form.querySelector('[name="email"]')?.value.trim();
        const message = form.querySelector('[name="message"]')?.value.trim();

        if (!name || !phone || !message) {
            showFormMessage(form, "❌ Заполните обязательные поля (Имя, Телефон, Сообщение)", "error");
            return;
        }
        const phoneRegex = /^[\d\s\+\(\)\-]{10,18}$/;
        if (!phoneRegex.test(phone)) {
            showFormMessage(form, "❌ Введите корректный номер телефона (10-18 цифр)", "error");
            return;
        }
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            showFormMessage(form, "❌ Неверный формат email", "error");
            return;
        }
        showFormMessage(form, successMsg, "success");
        form.reset();
    });
}

function showFormMessage(form, text, type) {
    let msgDiv = form.querySelector('.form-message');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.className = 'form-message';
        form.appendChild(msgDiv);
    }
    msgDiv.textContent = text;
    msgDiv.style.color = type === 'error' ? '#c62828' : '#2e7d32';
    setTimeout(() => msgDiv.textContent = '', 4000);
}

handleFormSubmit('feedback-form-main', "✅ Спасибо! Ваша заявка отправлена. Скоро свяжемся.");
handleFormSubmit('subsidies-question-form', "✅ Ваш вопрос получен. Скоро свяжемся.");
handleFormSubmit('contacts-form', "✅ Спасибо! Ваше сообщение отправлено. Мы ответим в ближайшее время.");

// -------------------- БУРГЕР-МЕНЮ --------------------
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
if (burger && navMenu) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('active');
    });
}