document.addEventListener('DOMContentLoaded', () => {
    // 1. Variáveis de Elementos DOM
    const distanciaSlider = document.getElementById('distanciaSlider');
    const distanciaAtualSpan = document.getElementById('distanciaAtual');
    const statusAlarmeDiv = document.getElementById('statusAlarme');
    const textoStatusSpan = document.getElementById('textoStatus');
    const btnAtivar = document.getElementById('btnAtivar');
    const somAlarme = document.getElementById('somAlarme');
    
    // 2. Variáveis de Estado
    let isSistemaAtivo = false;
    const DISTANCIA_LIMITE = 20; // Distância (em cm) para disparar o alarme

    // 3. Função de Atualização do Sensor
    function monitorarSensor() {
        const distanciaLida = parseInt(distanciaSlider.value);
        distanciaAtualSpan.textContent = `${distanciaLida} cm`;

        if (!isSistemaAtivo) {
            // Se o sistema estiver desativado, apenas atualiza a distância
            return;
        }

        // Lógica do Alarme
        if (distanciaLida < DISTANCIA_LIMITE) {
            // Alarme Ativado (Disparado)
            dispararAlarme();
        } else {
            // Alarme Armado, mas sem detecção de perigo
            alertaSilencioso();
        }
    }

    // 4. Funções de Alarme
    function dispararAlarme() {
        if (!statusAlarmeDiv.classList.contains('status-triggered')) {
            // Atualiza o visual
            statusAlarmeDiv.className = 'status-triggered';
            textoStatusSpan.textContent = 'ALARME DISPARADO! - Detecção';
            
            // Toca o som (tenta tocar, pode falhar devido a políticas de navegador)
            somAlarme.play().catch(error => {
                console.warn("Não foi possível tocar o som automaticamente. Interação do usuário é necessária.", error);
            });
        }
    }

    function alertaSilencioso() {
        // Se estiver disparado, volta para o estado Armado
        if (statusAlarmeDiv.classList.contains('status-triggered')) {
            statusAlarmeDiv.className = 'status-armed';
            textoStatusSpan.textContent = 'Sistema Ativo (Armado)';
            somAlarme.pause();
            somAlarme.currentTime = 0; // Reinicia o som
        }
    }

    // 5. Função de Controle do Sistema
    function toggleSistema() {
        isSistemaAtivo = !isSistemaAtivo;

        if (isSistemaAtivo) {
            // ATIVAR o Sistema
            statusAlarmeDiv.className = 'status-armed';
            textoStatusSpan.textContent = 'Sistema Ativo (Armado)';
            btnAtivar.textContent = 'Desativar Sistema';
            btnAtivar.classList.add('btn-desativar');
            monitorarSensor(); // Verifica o estado inicial
        } else {
            // DESATIVAR o Sistema
            statusAlarmeDiv.className = 'status-off';
            textoStatusSpan.textContent = 'Sistema Desativado';
            btnAtivar.textContent = 'Ativar Sistema';
            btnAtivar.classList.remove('btn-desativar');
            somAlarme.pause();
            somAlarme.currentTime = 0;
        }
    }

    // 6. Configuração de Eventos
    
    // Liga a mudança do slider à função de monitoramento
    distanciaSlider.addEventListener('input', monitorarSensor);

    // Liga o botão de ativação/desativação
    btnAtivar.addEventListener('click', toggleSistema);

    // Inicializa a exibição da distância
    monitorarSensor();
});
