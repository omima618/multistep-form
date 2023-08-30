const genderWrapper = document.querySelector('.gender-selection');
const genderOptions = document.querySelectorAll('.gender-selection .gender');
const showFormBtn = document.querySelector('.gender-selection .show-form');

genderOptions.forEach((gender, i) => {
    gender.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
            i === 0 ? genderOptions[i + 1].classList.remove('selected') : genderOptions[i - 1].classList.remove('selected');
            this.classList.add('selected');
        } 
        showFormBtn.dataset.selectedGender = this.dataset.gender;
        showFormBtn.classList.remove('hidden');
        window.scroll({ top: showFormBtn.getBoundingClientRect().top + 50, behavior: 'smooth' });
        showFormBtn.classList.add('animate');
        setTimeout(() => {
            showFormBtn.classList.remove('animate');
        }, 1200);
    });
})

showFormBtn.addEventListener('click', () => {
    genderWrapper.classList.add('switch-effect');
    setTimeout(() => {
        genderWrapper.classList.add('hidden');
    }, 300);
    setTimeout(() => {
        getStepsHandler(showFormBtn.dataset.selectedGender);
    }, 400);
});

function renderStepsHeader(questions) {
    const steps = questions.map((question) => {
        return question.step;
    });
    const stepWrapper = document.querySelector('.steps-header .steps-wrapper');
    steps.forEach(function (step, i) {
        const stepMarkup = `
        <div class="step ${i === 0 ? 'active' : ''}" data-step=${i + 1}>
            <span class="step-icon">
                ${step.stepIcon}
            </span>
            <div class="step-desc">
                <span class="step-num">
                    السؤال 
                    ${step.stepNum} / ${steps.length}
                </span>
            </div>
        </div>
        `;
        stepWrapper.insertAdjacentHTML('beforeend', stepMarkup);
    });
}

function generateAnswersMarkup(answers, questionIndex) {
    questionIndex;
    let answersMarkup = '';
    answers.options.forEach((option, i) => {
        answersMarkup += `
                <div class="answer-wrapper ${i === 0 ? 'selected' : ''}">
                    <label for=q-${questionIndex}-answer-${i + 1}>
                        <span class="answer-img">
                            <img src="${answers.images[i]}">
                        </span>
                        <span class="answer">${option}</span>
                    </label>
                    <input type="radio" ${i === 0 ? 'checked' : ''} class="answer-inp" id=q-${questionIndex}-answer-${i + 1} name="q-${questionIndex}" value="q-${questionIndex}-answer-${i + 1}">
                </div>
            `;
    });
    return answersMarkup;
}

function initSelectEvent() {
    document.querySelectorAll('.answer-inp').forEach((inp) => {
        inp.addEventListener('click', function () {
            if (inp.closest('.answer-wrapper').classList.contains('selected')) {
                setTimeout(() => {
                    document.querySelector('.move-to-next-step-btn').click();
                }, 300);
                return;
            }
            Array.from(inp.closest('.answers-wrapper').children).forEach((answer) => {
                answer.classList.remove('selected');
            });
            inp.closest('.answer-wrapper').classList.add('selected');
            setTimeout(() => {
                document.querySelector('.move-to-next-step-btn').click();
            }, 300);
        });
    });
}

function renderFormStepQuestions(questions) {
    const formStepsWrapper = document.querySelector('.multistep-form-wrapper .form-steps-wrapper');
    questions.forEach((question, i) => {
        const stepMarkup = `
            <div class="form-step ${i + 1 === 1 ? 'active' : ''}" data-step="${i + 1}">
                <div class="question-wrapper">
                <p class="question">${question.question}</p>
                <div class="answers-wrapper">
                    ${generateAnswersMarkup(question.answers, i + 1)}
                </div>
                </div>
            </div>
        `;
        formStepsWrapper.insertAdjacentHTML('beforeend', stepMarkup);
    });
    initSelectEvent();
    document.querySelector('.multistep-form-wrapper').classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('.multistep-form-wrapper').classList.remove('switch-effect');
    }, 200);
}

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

function getStepsHandler(gender) {
    const MSF_fetchStepsRes = fetch('data/steps.json');
    MSF_fetchStepsRes.then(function (res) {
        return res.json();
    }).then(function (data) {
        renderStepsHeader(data.questions[gender]);
        renderFormStepQuestions(data.questions[gender]);
    });
}

function getProductsHandler(gender) {
    const MSF_fetchProductsRes = fetch('data/products.json');
    MSF_fetchProductsRes.then(function (res) {
        return res.json();
    }).then(function (data) {
        const products = data.products[gender];
        const randomProduct = products[Math.floor(Math.random()*products.length)];
        document.querySelector('.preferences-test-done .products-container').insertAdjacentHTML('beforeend', renderProducts(randomProduct));
        document.querySelector('.multistep-form-wrapper').classList.remove('hidden');
        setTimeout(() => {
            document.querySelector('.preferences-test-done').classList.remove('switch-effect');
        }, 600);
    });
}

function submitAndGetResult(e) {
    e.preventDefault();
    getProductsHandler(showFormBtn.dataset.selectedGender);
    document.querySelector('.multistep-form-wrapper').classList.add('switch-effect');
    setTimeout(() => {
        document.querySelector('.multistep-form-wrapper').classList.add('hidden');
    }, 600);
}

function checkSubmitBtn(currentStep) {
    const nextStepNum = currentStep + 1;
    const nextStep = document.querySelector(`.form-step[data-step='${nextStepNum}']`);
    if (nextStep) {
        document.querySelector('.buttons-wrapper .submit-form-btn').classList.add('hidden');
        document.querySelector('.buttons-wrapper .move-to-next-step-btn').classList.remove('hidden');
    } else {
        document.querySelector('.buttons-wrapper .move-to-next-step-btn').classList.add('hidden');
        document.querySelector('.buttons-wrapper .submit-form-btn').classList.remove('hidden');
    }
    document.querySelector('.buttons-wrapper .submit-form-btn').classList.remove('animate');
}

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
            setTimeout(() => {
                window.scroll({ top: formContainer.getBoundingClientRect().top, behavior: 'smooth' });
                headerCurrentStep.classList.remove('active');
                formCurrentStep.classList.remove('active');
                document.querySelector(`.steps-header .step[data-step='${currentStepNum + 1}']`).classList.add('active');
                nextStep.classList.add('active');
                buttonsWrapper.classList.remove('no-prev');
                buttonsWrapper.dataset.currentStep = currentStepNum + 1;
                checkSubmitBtn(currentStepNum + 1);
                formContainer.classList.remove('switch-effect');
            }, 500);
        } else {
            window.scroll({ top: buttonsWrapper.getBoundingClientRect().top + 50, behavior: 'smooth' });
            buttonsWrapper.querySelector('.submit-form-btn').classList.add('animate');
            setTimeout(() => {
                buttonsWrapper.querySelector('.submit-form-btn').classList.remove('animate');
            }, 1200);
        }
    } else {
        if (currentStepNum > 1) {
            formContainer.classList.add('switch-effect');
            setTimeout(() => {
                window.scroll({ top: formContainer.getBoundingClientRect().top, behavior: 'smooth' });
                headerCurrentStep.classList.remove('active');
                formCurrentStep.classList.remove('active');
                const prevStep = document.querySelector(`.form-step[data-step='${currentStepNum - 1}']`);
                document.querySelector(`.steps-header .step[data-step='${currentStepNum - 1}']`).classList.add('active');
                prevStep.classList.add('active');
                currentStepNum - 1 > 1 ? buttonsWrapper.classList.remove('no-prev') : buttonsWrapper.classList.add('no-prev');
                buttonsWrapper.dataset.currentStep = currentStepNum - 1;
                checkSubmitBtn(currentStepNum - 1);
                formContainer.classList.remove('switch-effect');
            }, 600);
        }
    }
}

document.querySelector('.back-to-gender-selection').addEventListener('click', function () {
    document.querySelector('.multistep-form-wrapper').classList.add('switch-effect');
    setTimeout(() => {
        document.querySelector('.multistep-form-wrapper').classList.add('hidden');
        showFormBtn.classList.add('hidden');
        genderWrapper.classList.remove('hidden');
        setTimeout(() => {
            genderWrapper.classList.remove('switch-effect');
            document.querySelector('.steps-header .steps-wrapper').innerHTML = '';
            document.querySelector('.multistep-form-wrapper .form-steps-wrapper').innerHTML = '';
            document.querySelector('.buttons-wrapper').classList.add('no-prev');
            document.querySelector('.buttons-wrapper').dataset.currentStep = 1;
        }, 200);
    }, 600);
})

document.querySelector('.move-to-next-step-btn').addEventListener('click', function (e) {
    switchStepsHandler(e, this);
});

document.querySelector('.back-to-prev-step-btn').addEventListener('click', function (e) {
    switchStepsHandler(e, this);
});

document.querySelector('.submit-form-btn').addEventListener('click', function (e) {
    submitAndGetResult(e);
});

document.querySelector('.start-over').addEventListener('click', () => location.reload());