function renderProducts(product) {
    const productMarkup = `
    <div class="product-wrapper">
        <a href="${product.link}" class="product-img">
            <img src="${product.image}" alt="${product.title}">
        </a>
        <div class="links-wrapper">
            <a class="product-title" target="_blank" href="${product.link}">${product.title}</a>
            <a class="see-more"  target="_blank" href="${product.link}">المزيد عن العطر</a>
        </div>
    </div>
    `;
    return productMarkup;
}

function getProductsHandler() {
    var MSF_fetchProductsRes = fetch('../data/products.json');
    MSF_fetchProductsRes.then(function (res) {
        return res.json();
    }).then(function (data) {
        const randomProduct = data.products[Math.floor(Math.random()*data.products.length)];
        document.querySelector('.preferences-test-done .products-container').insertAdjacentHTML('beforeend', renderProducts(randomProduct));
        document.querySelector('.multistep-form-wrapper').classList.remove('hidden');
        setTimeout(() => {
            document.querySelector('.preferences-test-done').classList.remove('switch-effect');
        }, 600);
    });
}

function renderStepsHeader(steps) {
    const stepWrapper = document.querySelector('.steps-wrapper');
    steps.forEach(function (step, i) {
        const stepMarkup = `
        <div class="step ${i === 0 ? 'active' : ''}" data-step=${i + 1}>
            <span class="step-icon">
                ${step.stepIcon}
            </span>
            <div class="step-desc">
                <span class="step-num">
                    الخطوة
                    ${step.stepNum} / ${steps.length}
                </span>
                <p class="step-title">
                    ${step.title}
                </p>
            </div>
        </div>
        `;
        stepWrapper.insertAdjacentHTML('beforeend', stepMarkup);
    });
}

function generateAnswersMarkup(questionData, questionIndex, stepCounter) {
    questionIndex++;
    let answersMarkup = '';
    questionData.answers.options.forEach((option, i) => {
        answersMarkup += `
                <div class="answer-wrapper ${i === 0 ? 'selected' : ''}">
                    <label for=step-${stepCounter}-q-${questionIndex}-answer-${i + 1}>
                        <span class="answer-img">
                            <img src="${questionData.answers.images[i]}">
                        </span>
                        <span class="answer">${option}</span>
                    </label>
                    <input type="radio" ${i === 0 ? 'checked' : ''} class="answer-inp" id=step-${stepCounter}-q-${questionIndex}-answer-${
            i + 1
        } name="step-${stepCounter}-q-${questionIndex}" value="step-${stepCounter}-q-${questionIndex}-answer-${i + 1}">
                </div>
            `;
    });
    return answersMarkup;
}

function generateQuestionsMarkup(stepQuestionsData, stepCounter) {
    let questionsMarkup = '';
    stepQuestionsData.forEach((questionData, index) => {
        questionsMarkup += `
                <div class="question-wrapper">
                    <p class="question">${questionData.question}</p>
                    <div class="answers-wrapper">
                        ${generateAnswersMarkup(questionData, index, stepCounter)}
                    </div>
                </div>
            `;
    });
    return questionsMarkup;
}

function initSelectEvent() {
    document.querySelectorAll('.answer-inp').forEach((inp) => {
        inp.addEventListener('change', function () {
            if (inp.classList.contains('selected')) {
                return;
            }
            Array.from(inp.closest('.answers-wrapper').children).forEach((answer) => {
                answer.classList.remove('selected');
            });
            inp.closest('.answer-wrapper').classList.add('selected');
        });
    });
}

function renderFormStepQuestions(stepsQuestions) {
    const formStepsWrapper = document.querySelector('.form-steps-wrapper');
    let stepCounter = 1;
    for (const step in stepsQuestions) {
        const stepQuestionsData = stepsQuestions[step];
        const stepMarkup = `
            <div class="form-step ${stepCounter === 1 ? 'active' : ''}" data-step="${stepCounter}">
                ${generateQuestionsMarkup(stepQuestionsData, stepCounter)}
            </div>
        `;
        formStepsWrapper.insertAdjacentHTML('beforeend', stepMarkup);
        stepCounter++;
    }
    initSelectEvent();
    document.querySelector('.multistep-form-wrapper').classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('.multistep-form-wrapper').classList.remove('switch-effect');
    }, 300)
}

function getStepsHandler() {
    var MSF_fetchStepsRes = fetch('../data/steps.json');
    MSF_fetchStepsRes.then(function (res) {
        return res.json();
    }).then(function (data) {
        renderStepsHeader(data.steps);
        renderFormStepQuestions(data.questions);
    });
}

getStepsHandler();

function switchStepsHandler(e, btn) {
    e.preventDefault();
    const formContainer = document.querySelector('.multistep-form-wrapper');
    const buttonsWrapper = document.querySelector('.buttons-wrapper');
    const currentStepNum = +buttonsWrapper.dataset.currentStep;
    const headerCurrentStep = document.querySelector(`.steps-header .step[data-step='${currentStepNum}']`);
    const formCurrentStep = document.querySelector(`.form-step[data-step='${currentStepNum}']`);
    if (btn.dataset.move === 'forward') {
        const nextStep = document.querySelector(`.form-step[data-step='${currentStepNum + 1}']`);
        if (nextStep) {
            formContainer.classList.add('switch-effect');
            headerCurrentStep.classList.remove('active');
            formCurrentStep.classList.remove('active');
            document.querySelector(`.steps-header .step[data-step='${currentStepNum + 1}']`).classList.add('active');
            nextStep.classList.add('active');
            buttonsWrapper.classList.remove('no-prev');
            buttonsWrapper.dataset.currentStep = currentStepNum + 1;
            setTimeout(() => {
                window.scroll({top: formContainer.getBoundingClientRect().top, behavior:'smooth'})
                formContainer.classList.remove('switch-effect');
            }, 600)
        } else {
            getProductsHandler();
            document.querySelector('.multistep-form-wrapper').classList.add('switch-effect');
            setTimeout(() => {
                document.querySelector('.multistep-form-wrapper').classList.add('hidden');
            }, 600)
        }
    } else {
        if (currentStepNum > 1) {
            formContainer.classList.add('switch-effect');
            headerCurrentStep.classList.remove('active');
            formCurrentStep.classList.remove('active');
            const prevStep = document.querySelector(`.form-step[data-step='${currentStepNum - 1}']`);
            document.querySelector(`.steps-header .step[data-step='${currentStepNum - 1}']`).classList.add('active');
            prevStep.classList.add('active');
            currentStepNum - 1 > 1 ? buttonsWrapper.classList.remove('no-prev') : buttonsWrapper.classList.add('no-prev');
            buttonsWrapper.dataset.currentStep = currentStepNum - 1;
            setTimeout(() => {
                window.scroll({top: formContainer.getBoundingClientRect().top, behavior:'smooth'})
                formContainer.classList.remove('switch-effect');
            }, 600)
        }
    }
}

document.querySelector('.move-to-next-step-btn').addEventListener('click', function (e) {
    switchStepsHandler(e, this);
});

document.querySelector('.back-to-prev-step-btn').addEventListener('click', function (e) {
    switchStepsHandler(e, this);
});

document.querySelector('.start-over').addEventListener('click', () => location.reload());