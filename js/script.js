// Inicialização principal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o drawer em todas as páginas
    initDrawer();
    
    // Inicializar o menu mobile
    initMobileMenu();
    
    // Inicializar ferramentas interativas se estiverem presentes na página
    initHabitTracker();
    initImplementationIntentions();
    initHabitStacking();
    initTemptationBundling();
});

// Menu Mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    let menuOverlay;

    // Verificar se os elementos do menu existem
    if (!menuToggle || !navMenu) {
        console.error('Elementos do menu não encontrados');
        return;
    }

    // Criar overlay para fechar o menu quando clicar fora
    function createOverlay() {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
        
        // Adicionar evento para fechar o menu quando clicar no overlay
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    // Função para fechar o menu
    function closeMenu() {
        navMenu.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.remove();
        }
    }

    menuToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            navMenu.classList.add('active');
            createOverlay();
        }
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Fechar menu ao pressionar a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Rastreador de Hábitos
function initHabitTracker() {
    const habitForm = document.getElementById('habit-form');
    const habitList = document.getElementById('habit-list');
    const calendarContainer = document.getElementById('calendar');

    if (!habitForm) return;

    // Carregar hábitos salvos
    loadHabits();

    // Adicionar novo hábito
    habitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const habitInput = document.getElementById('habit-input');
        const habitCategory = document.getElementById('habit-category');
        const habitName = habitInput.value.trim();
        const category = habitCategory ? habitCategory.value : 'Geral';

        if (habitName) {
            addHabit(habitName, category);
            habitInput.value = '';
            saveHabits();
        }
    });

    // Função para adicionar hábito à lista
    function addHabit(name, category = '', color = '') {
        const habitId = 'habit-' + Date.now();
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.dataset.id = habitId;
        
        // Definir categoria padrão se não for fornecida
        if (!category) category = 'Geral';
        
        // Definir cor padrão se não for fornecida
        if (!color) {
            // Cores predefinidas para categorias comuns
            const categoryColors = {
                'Saúde': '#4cc9f0',
                'Trabalho': '#4361ee',
                'Estudos': '#3a0ca3',
                'Pessoal': '#f72585',
                'Geral': '#adb5bd'
            };
            color = categoryColors[category] || categoryColors['Geral'];
        }
        
        habitItem.dataset.category = category;
        habitItem.dataset.color = color;
        habitItem.style.borderLeft = `4px solid ${color}`;

        habitItem.innerHTML = `
            <div class="habit-info">
                <span class="habit-name">${name}</span>
                <span class="habit-category">${category}</span>
            </div>
            <div class="habit-controls">
                <button class="edit" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="delete" title="Excluir"><i class="fas fa-trash"></i></button>
            </div>
        `;

        habitList.appendChild(habitItem);

        // Adicionar eventos aos botões
        const editBtn = habitItem.querySelector('.edit');
        const deleteBtn = habitItem.querySelector('.delete');

        editBtn.addEventListener('click', function() {
            // Criar um formulário de edição
            const form = document.createElement('div');
            form.className = 'edit-habit-form';
            form.innerHTML = `
                <h4>Editar Hábito</h4>
                <div class="form-group">
                    <label for="edit-name">Nome:</label>
                    <input type="text" id="edit-name" value="${name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-category">Categoria:</label>
                    <select id="edit-category">
                        <option value="Geral" ${category === 'Geral' ? 'selected' : ''}>Geral</option>
                        <option value="Saúde" ${category === 'Saúde' ? 'selected' : ''}>Saúde</option>
                        <option value="Trabalho" ${category === 'Trabalho' ? 'selected' : ''}>Trabalho</option>
                        <option value="Estudos" ${category === 'Estudos' ? 'selected' : ''}>Estudos</option>
                        <option value="Pessoal" ${category === 'Pessoal' ? 'selected' : ''}>Pessoal</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" id="save-edit" class="btn-primary">Salvar</button>
                    <button type="button" id="cancel-edit" class="btn-secondary">Cancelar</button>
                </div>
            `;
            
            // Criar overlay para o modal
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.appendChild(form);
            document.body.appendChild(overlay);
            
            // Focar no campo de nome
            document.getElementById('edit-name').focus();
            
            // Adicionar eventos aos botões do formulário
            document.getElementById('save-edit').addEventListener('click', function() {
                const newName = document.getElementById('edit-name').value.trim();
                const newCategory = document.getElementById('edit-category').value;
                
                if (newName) {
                    // Atualizar nome e categoria
                    habitItem.querySelector('.habit-name').textContent = newName;
                    habitItem.querySelector('.habit-category').textContent = newCategory;
                    
                    // Atualizar cor baseada na categoria
                    const categoryColors = {
                        'Saúde': '#4cc9f0',
                        'Trabalho': '#4361ee',
                        'Estudos': '#3a0ca3',
                        'Pessoal': '#f72585',
                        'Geral': '#adb5bd'
                    };
                    const newColor = categoryColors[newCategory] || categoryColors['Geral'];
                    
                    habitItem.dataset.category = newCategory;
                    habitItem.dataset.color = newColor;
                    habitItem.style.borderLeft = `4px solid ${newColor}`;
                    
                    saveHabits();
                    overlay.remove();
                }
            });
            
            document.getElementById('cancel-edit').addEventListener('click', function() {
                overlay.remove();
            });
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir este hábito?')) {
                habitItem.remove();
                saveHabits();
                updateCalendar();
            }
        });
    }

    // Salvar hábitos no localStorage
    function saveHabits() {
        const habits = [];
        document.querySelectorAll('.habit-item').forEach(item => {
            habits.push({
                id: item.dataset.id,
                name: item.querySelector('.habit-name').textContent,
                category: item.dataset.category || 'Geral',
                color: item.dataset.color || '#adb5bd'
            });
        });
        localStorage.setItem('habits', JSON.stringify(habits));
        updateCalendar();
    }

    // Carregar hábitos do localStorage
    function loadHabits() {
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.forEach(habit => {
            addHabit(habit.name, habit.category, habit.color);
        });
        loadCompletions();
        updateCalendar();
    }

    // Atualizar calendário
    function updateCalendar() {
        if (!calendarContainer) return;

        calendarContainer.innerHTML = '';

        // Adicionar cabeçalho dos dias da semana
        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarContainer.appendChild(dayElement);
        });

        // Obter data atual
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Obter primeiro dia do mês e total de dias
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();

        // Adicionar dias vazios até o primeiro dia do mês
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-date empty';
            calendarContainer.appendChild(emptyDay);
        }

        // Adicionar dias do mês
        const completions = getCompletions();

        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = formatDate(date);
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.textContent = day;
            dateElement.dataset.date = dateString;

            // Marcar dia atual
            if (day === today.getDate()) {
                dateElement.classList.add('today');
            }

            // Verificar se há hábitos completados neste dia
            const dayCompletions = completions[dateString] || [];
            const habits = document.querySelectorAll('.habit-item');
            let allCompleted = habits.length > 0;

            habits.forEach(habit => {
                if (!dayCompletions.includes(habit.dataset.id)) {
                    allCompleted = false;
                }
            });

            if (allCompleted && habits.length > 0) {
                dateElement.classList.add('completed');
            }

            // Adicionar evento de clique para marcar/desmarcar hábitos
            dateElement.addEventListener('click', function() {
                toggleHabitsForDate(dateString);
            });

            calendarContainer.appendChild(dateElement);
        }
    }

    // Formatar data como YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Alternar conclusão de hábitos para uma data
    function toggleHabitsForDate(dateString) {
        const completions = getCompletions();
        const dateCompletions = completions[dateString] || [];
        const habits = document.querySelectorAll('.habit-item');
        const dateElement = document.querySelector(`.calendar-date[data-date="${dateString}"]`);

        // Verificar se todos os hábitos estão completos
        let allCompleted = habits.length > 0;
        habits.forEach(habit => {
            if (!dateCompletions.includes(habit.dataset.id)) {
                allCompleted = false;
            }
        });

        // Se todos estiverem completos, desmarcar todos; caso contrário, marcar todos
        if (allCompleted) {
            completions[dateString] = [];
            dateElement.classList.remove('completed');
        } else {
            completions[dateString] = Array.from(habits).map(habit => habit.dataset.id);
            dateElement.classList.add('completed');
        }

        // Salvar completions
        localStorage.setItem('habitCompletions', JSON.stringify(completions));
        
        // Atualizar o calendário para refletir as mudanças
        updateCalendar();
    }

    // Obter completions do localStorage
    function getCompletions() {
        return JSON.parse(localStorage.getItem('habitCompletions')) || {};
    }

    // Carregar completions
    function loadCompletions() {
        // Já é carregado no updateCalendar
    }
}

// Intenções de Implementação
function initImplementationIntentions() {
    const intentionForm = document.getElementById('intention-form');
    const intentionsList = document.getElementById('intentions-list');

    if (!intentionForm) return;

    // Carregar intenções salvas
    loadIntentions();

    // Adicionar nova intenção
    intentionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const situation = document.getElementById('situation-input').value.trim();
        const behavior = document.getElementById('behavior-input').value.trim();
        const time = document.getElementById('time-input').value.trim();
        const location = document.getElementById('location-input').value.trim();

        if (situation && behavior) {
            addIntention(situation, behavior, time, location);
            intentionForm.reset();
            saveIntentions();
        }
    });

    // Função para adicionar intenção à lista
    function addIntention(situation, behavior, time, location) {
        const intentionId = 'intention-' + Date.now();
        const intentionItem = document.createElement('div');
        intentionItem.className = 'intention-item';
        intentionItem.dataset.id = intentionId;

        const timeLocation = [];
        if (time) timeLocation.push(`às ${time}`);
        if (location) timeLocation.push(`em ${location}`);
        const timeLocationText = timeLocation.length > 0 ? ` ${timeLocation.join(' ')}` : '';

        intentionItem.innerHTML = `
            <p>Quando <strong>${situation}</strong>, eu farei <strong>${behavior}</strong>${timeLocationText}.</p>
            <div class="intention-controls">
                <button class="edit" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="delete" title="Excluir"><i class="fas fa-trash"></i></button>
            </div>
        `;

        intentionsList.appendChild(intentionItem);

        // Adicionar eventos aos botões
        const editBtn = intentionItem.querySelector('.edit');
        const deleteBtn = intentionItem.querySelector('.delete');

        editBtn.addEventListener('click', function() {
            document.getElementById('situation-input').value = situation;
            document.getElementById('behavior-input').value = behavior;
            document.getElementById('time-input').value = time;
            document.getElementById('location-input').value = location;
            intentionItem.remove();
            saveIntentions();
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir esta intenção?')) {
                intentionItem.remove();
                saveIntentions();
            }
        });
    }

    // Salvar intenções no localStorage
    function saveIntentions() {
        const intentions = [];
        document.querySelectorAll('.intention-item').forEach(item => {
            const text = item.querySelector('p').innerHTML;
            const situationMatch = text.match(/Quando <strong>(.+?)<\/strong>/);
            const behaviorMatch = text.match(/eu farei <strong>(.+?)<\/strong>/);
            const timeMatch = text.match(/às (.+?) em/) || text.match(/às (.+?)\.<\/p>/);
            const locationMatch = text.match(/em (.+?)\.<\/p>/);

            intentions.push({
                id: item.dataset.id,
                situation: situationMatch ? situationMatch[1] : '',
                behavior: behaviorMatch ? behaviorMatch[1] : '',
                time: timeMatch ? timeMatch[1] : '',
                location: locationMatch ? locationMatch[1] : ''
            });
        });
        localStorage.setItem('intentions', JSON.stringify(intentions));
    }

    // Carregar intenções do localStorage
    function loadIntentions() {
        const intentions = JSON.parse(localStorage.getItem('intentions')) || [];
        intentions.forEach(intention => {
            addIntention(intention.situation, intention.behavior, intention.time, intention.location);
        });
    }
}

// Empilhamento de Hábitos
function initHabitStacking() {
    const stackingForm = document.getElementById('stacking-form');
    const stackingList = document.getElementById('stacking-list');

    if (!stackingForm) return;

    // Carregar empilhamentos salvos
    loadStackings();

    // Adicionar novo empilhamento
    stackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentHabit = document.getElementById('current-habit-input').value.trim();
        const newHabit = document.getElementById('new-habit-input').value.trim();

        if (currentHabit && newHabit) {
            addStacking(currentHabit, newHabit);
            stackingForm.reset();
            saveStackings();
        }
    });

    // Função para adicionar empilhamento à lista
    function addStacking(currentHabit, newHabit) {
        const stackingId = 'stacking-' + Date.now();
        const stackingItem = document.createElement('div');
        stackingItem.className = 'stacking-item';
        stackingItem.dataset.id = stackingId;

        stackingItem.innerHTML = `
            <p>Depois de <strong>${currentHabit}</strong>, eu irei <strong>${newHabit}</strong>.</p>
            <div class="stacking-controls">
                <button class="edit" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="delete" title="Excluir"><i class="fas fa-trash"></i></button>
            </div>
        `;

        stackingList.appendChild(stackingItem);

        // Adicionar eventos aos botões
        const editBtn = stackingItem.querySelector('.edit');
        const deleteBtn = stackingItem.querySelector('.delete');

        editBtn.addEventListener('click', function() {
            document.getElementById('current-habit-input').value = currentHabit;
            document.getElementById('new-habit-input').value = newHabit;
            stackingItem.remove();
            saveStackings();
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir este empilhamento?')) {
                stackingItem.remove();
                saveStackings();
            }
        });
    }

    // Salvar empilhamentos no localStorage
    function saveStackings() {
        const stackings = [];
        document.querySelectorAll('.stacking-item').forEach(item => {
            const text = item.querySelector('p').innerHTML;
            const currentMatch = text.match(/Depois de <strong>(.+?)<\/strong>/);
            const newMatch = text.match(/eu irei <strong>(.+?)<\/strong>/);

            stackings.push({
                id: item.dataset.id,
                currentHabit: currentMatch ? currentMatch[1] : '',
                newHabit: newMatch ? newMatch[1] : ''
            });
        });
        localStorage.setItem('stackings', JSON.stringify(stackings));
    }

    // Carregar empilhamentos do localStorage
    function loadStackings() {
        const stackings = JSON.parse(localStorage.getItem('stackings')) || [];
        stackings.forEach(stacking => {
            addStacking(stacking.currentHabit, stacking.newHabit);
        });
    }
}

// Empacotamento de Tentação
function initTemptationBundling() {
    const bundlingForm = document.getElementById('bundling-form');
    const bundlingList = document.getElementById('bundling-list');

    if (!bundlingForm) return;

    // Carregar empacotamentos salvos
    loadBundlings();

    // Adicionar novo empacotamento
    bundlingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const needHabit = document.getElementById('need-habit-input').value.trim();
        const wantHabit = document.getElementById('want-habit-input').value.trim();

        if (needHabit && wantHabit) {
            addBundling(needHabit, wantHabit);
            bundlingForm.reset();
            saveBundlings();
        }
    });

    // Função para adicionar empacotamento à lista
    function addBundling(needHabit, wantHabit) {
        const bundlingId = 'bundling-' + Date.now();
        const bundlingItem = document.createElement('div');
        bundlingItem.className = 'bundling-item';
        bundlingItem.dataset.id = bundlingId;

        bundlingItem.innerHTML = `
            <p>Depois de <strong>${needHabit}</strong>, eu vou <strong>${wantHabit}</strong>.</p>
            <div class="bundling-controls">
                <button class="edit" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="delete" title="Excluir"><i class="fas fa-trash"></i></button>
            </div>
        `;

        bundlingList.appendChild(bundlingItem);

        // Adicionar eventos aos botões
        const editBtn = bundlingItem.querySelector('.edit');
        const deleteBtn = bundlingItem.querySelector('.delete');

        editBtn.addEventListener('click', function() {
            document.getElementById('need-habit-input').value = needHabit;
            document.getElementById('want-habit-input').value = wantHabit;
            bundlingItem.remove();
            saveBundlings();
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir este empacotamento?')) {
                bundlingItem.remove();
                saveBundlings();
            }
        });
    }

    // Salvar empacotamentos no localStorage
    function saveBundlings() {
        const bundlings = [];
        document.querySelectorAll('.bundling-item').forEach(item => {
            const text = item.querySelector('p').innerHTML;
            const needMatch = text.match(/Depois de <strong>(.+?)<\/strong>/);
            const wantMatch = text.match(/eu vou <strong>(.+?)<\/strong>/);

            bundlings.push({
                id: item.dataset.id,
                needHabit: needMatch ? needMatch[1] : '',
                wantHabit: wantMatch ? wantMatch[1] : ''
            });
        });
        localStorage.setItem('bundlings', JSON.stringify(bundlings));
    }

    // Carregar empacotamentos do localStorage
    function loadBundlings() {
        const bundlings = JSON.parse(localStorage.getItem('bundlings')) || [];
        bundlings.forEach(bundling => {
            addBundling(bundling.needHabit, bundling.wantHabit);
        });
    }
}

// Animações
function animateElements() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Inicializar animações quando a página carregar
window.addEventListener('load', animateElements);

// Função para inicializar o drawer
function initDrawer() {
    const drawerToggle = document.querySelector('.drawer-toggle');
    const drawer = document.querySelector('.drawer');

    // Verificar se os elementos do drawer existem
    if (!drawerToggle || !drawer) {
        console.error('Elementos do drawer não encontrados');
        return;
    }

    // Adicionar evento de clique no toggle
    drawerToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Impedir propagação do evento
        drawer.classList.toggle('active');
        
        // Criar ou remover overlay quando o drawer é aberto/fechado
        if (drawer.classList.contains('active')) {
            createDrawerOverlay();
        } else {
            removeDrawerOverlay();
        }
    });
    
    // Função para criar overlay do drawer
    function createDrawerOverlay() {
        let drawerOverlay = document.querySelector('.drawer-overlay');
        
        // Criar overlay se não existir
        if (!drawerOverlay) {
            drawerOverlay = document.createElement('div');
            drawerOverlay.className = 'drawer-overlay';
            document.body.appendChild(drawerOverlay);
            
            // Adicionar evento para fechar o drawer quando clicar no overlay
            drawerOverlay.addEventListener('click', function() {
                drawer.classList.remove('active');
                removeDrawerOverlay();
            });
        }
        
        // Tornar overlay visível
        setTimeout(() => {
            drawerOverlay.classList.add('active');
        }, 10);
    }
    
    // Função para remover overlay do drawer
    function removeDrawerOverlay() {
        const drawerOverlay = document.querySelector('.drawer-overlay');
        if (drawerOverlay) {
            drawerOverlay.classList.remove('active');
            setTimeout(() => {
                drawerOverlay.remove();
            }, 300); // Tempo para a animação de fade-out completar
        }
    }

    // Fechar drawer ao clicar fora
    document.addEventListener('click', function(e) {
        if (drawer.classList.contains('active') && !drawer.contains(e.target) && !drawerToggle.contains(e.target)) {
            drawer.classList.remove('active');
            removeDrawerOverlay();
        }
    });
    
    // Fechar drawer ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            drawer.classList.remove('active');
            removeDrawerOverlay();
        }
    });}

