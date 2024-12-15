/*
 * Modificação do Script Fang God para automação de farm com agendamento de ataques
 * Versão: 1.3.0
 * Modificado por: Assistente
 */

// CONSTANTES
const FARM_SCHEDULE_KEY = 'farmSchedule_higamy'; // Chave para armazenamento local do agendamento

// Elementos da interface
let farmScheduleUI;
let attackScheduleInput;
let scheduleAttacksButton;

// Função para salvar o agendamento de ataques
function saveFarmSchedule(schedule) {
    localStorage.setItem(FARM_SCHEDULE_KEY, JSON.stringify(schedule));
    console.log("Agendamento salvo:", schedule);
}

// Função para carregar o agendamento de ataques
function loadFarmSchedule() {
    const schedule = JSON.parse(localStorage.getItem(FARM_SCHEDULE_KEY)) || [];
    console.log("Agendamento carregado:", schedule);
    return schedule;
}

// Função para inicializar o UI de agendamento
function createFarmScheduleUI() {
    farmScheduleUI = document.createElement('div');
    farmScheduleUI.style = `
        position: absolute;
        top: 200px;
        left: 10%;
        z-index: 1000;
        background: #f0e6d2;
        padding: 15px;
        border: 2px solid #603000;
        border-radius: 10px;
        width: 300px;
    `;

    farmScheduleUI.innerHTML = `
        <h3>Agendamento de Farm</h3>
        <label for="attackScheduleInput">Horários (HH:MM, separados por vírgula):</label>
        <textarea id="attackScheduleInput" rows="5" style="width: 100%;"></textarea>
        <button id="scheduleAttacksButton" style="margin-top: 10px;">Salvar Agendamento</button>
        <div id="scheduledTimes" style="margin-top: 15px;">
            <h4>Horários Agendados:</h4>
            <ul id="scheduleList"></ul>
        </div>
    `;

    document.body.appendChild(farmScheduleUI);

    // Elementos do UI
    attackScheduleInput = document.getElementById('attackScheduleInput');
    scheduleAttacksButton = document.getElementById('scheduleAttacksButton');

    // Listeners
    scheduleAttacksButton.addEventListener('click', () => {
        const rawInput = attackScheduleInput.value;
        const times = rawInput
            .split(',')
            .map((time) => time.trim())
            .filter((time) => /^\d{2}:\d{2}$/.test(time)); // Valida formato HH:MM

        if (times.length > 0) {
            saveFarmSchedule(times);
            updateScheduleList(times);
        } else {
            alert("Por favor, insira horários válidos no formato HH:MM.");
        }
    });

    // Carregar agendamento existente
    const savedSchedule = loadFarmSchedule();
    updateScheduleList(savedSchedule);
}

// Atualiza a lista de horários agendados no UI
function updateScheduleList(schedule) {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = '';

    schedule.forEach((time) => {
        const listItem = document.createElement('li');
        listItem.textContent = time;
        scheduleList.appendChild(listItem);
    });
}

// Função principal para automação de farm
async function automatedFarm() {
    const schedule = loadFarmSchedule();

    if (!schedule || schedule.length === 0) {
        console.log("Nenhum horário de farm agendado.");
        return;
    }

    const currentTime = new Date();
    const currentHHMM = `${String(currentTime.getHours()).padStart(2, '0')}:${String(
        currentTime.getMinutes()
    ).padStart(2, '0')}`;

    if (schedule.includes(currentHHMM)) {
        console.log("Executando farm para o horário:", currentHHMM);

        // Recuperar coordenadas e tropas configuradas
        const coordsInput = document.getElementById('coordsInput').value;
        const coords = coordsInput.split(' ').map((coord) => coord.split('|'));
        const troopSettings = getTroopSettings();

        // Simular envio para cada coordenada
        for (const coord of coords) {
            console.log(`Enviando tropas para: ${coord[0]}|${coord[1]}`);
            // Implementar lógica de envio baseado no template
        }
    }
}

// Obtém configurações de tropas do UI
function getTroopSettings() {
    const troopSettings = {};

    document.querySelectorAll('input[unit]').forEach((unitInput) => {
        const unitName = unitInput.getAttribute('unit');
        const unitValue = parseInt(unitInput.value) || 0;
        troopSettings[unitName] = unitValue;
    });

    return troopSettings;
}

// Inicializa o agendamento de farm e executa verificações periódicas
function initFarmAutomation() {
    createFarmScheduleUI();

    setInterval(() => {
        automatedFarm();
    }, 60 * 1000); // Verifica a cada minuto
}

// Executa a inicialização
initFarmAutomation();
