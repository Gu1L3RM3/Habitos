// Gerador de PDF para Ferramentas de Hábitos Atômicos

// Função para gerar PDF com todas as ferramentas
function generateToolsPDF() {
    // Importar jsPDF e html2canvas via CDN
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.body.appendChild(script2);

    // Verificar se as bibliotecas foram carregadas
    const checkLibraries = setInterval(() => {
        if (window.jspdf && window.html2canvas) {
            clearInterval(checkLibraries);
            createPDF();
        }
    }, 100);

    function createPDF() {
        // Mostrar mensagem de carregamento
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'pdf-loading';
        loadingMessage.innerHTML = `
            <div class="pdf-loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Gerando PDF, por favor aguarde...</p>
            </div>
        `;
        document.body.appendChild(loadingMessage);

        // Obter dados de todas as ferramentas
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        const habitCompletions = JSON.parse(localStorage.getItem('habitCompletions')) || {};
        const intentions = JSON.parse(localStorage.getItem('intentions')) || [];
        const stackings = JSON.parse(localStorage.getItem('stackings')) || [];
        const bundlings = JSON.parse(localStorage.getItem('bundlings')) || [];

        const { jsPDF } = window.jspdf;

        // Criar novo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = margin;

        // Cores do tema
        const primaryColor = [67, 97, 238]; // #4361ee
        const secondaryColor = [58, 12, 163]; // #3a0ca3
        const accentColor = [247, 37, 133]; // #f72585
        const darkColor = [33, 37, 41]; // #212529
        const grayColor = [173, 181, 189]; // #adb5bd
        const successColor = [76, 201, 240]; // #4cc9f0

        // Funções auxiliares
        function addPageIfNeeded(height = 10) {
            if (yPosition + height >= pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
                addFooter();
                return true;
            }
            return false;
        }

        function addFooter() {
            const currentPage = pdf.internal.getNumberOfPages();
            pdf.setFontSize(10);
            pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            pdf.text(`Página ${currentPage}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
            pdf.text('Hábitos Atômicos - Ferramentas', margin, pageHeight - 10);
        }

        // Adicionar cabeçalho simples ao PDF
        function addHeader() {
            // Título
            pdf.setFontSize(18);
            pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.text('Ferramentas de Hábitos Atômicos', pageWidth / 2, margin, { align: 'center' });
            
            // Data de geração
            const today = new Date();
            const formattedDate = today.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            pdf.setFontSize(10);
            pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            pdf.text(`Gerado em ${formattedDate}`, pageWidth - margin, margin, { align: 'right' });
            
            yPosition = margin + 15;
        }

        // Adicionar seção de rastreador de hábitos
        function addHabitsSection() {
            if (habits.length === 0) return;
            
            pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
            pdf.rect(margin, yPosition, contentWidth, 10, 'F');
            
            pdf.setFontSize(16);
            pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.text('Seus Hábitos', margin + 5, yPosition + 7);
            yPosition += 15;

            // Tabela de hábitos
            habits.forEach((habit, index) => {
                addPageIfNeeded(20);
                
                // Card para cada hábito
                pdf.setFillColor(252, 252, 252);
                pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.3);
                pdf.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'FD');
                
                pdf.setFontSize(11);
                pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
                pdf.text(habit.name, margin + 5, yPosition + 7);
                
                pdf.setFontSize(9);
                pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
                pdf.text(habit.category, margin + contentWidth - 5, yPosition + 7, { align: 'right' });
                
                yPosition += 20;
            });
            
            // Progresso recente foi removido junto com o calendário
        }

        // Adicionar seção de intenções de implementação
        function addIntentionsSection() {
            if (intentions.length === 0) return;
            
            addPageIfNeeded(30);
            
            pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 0.1);
            pdf.rect(margin, yPosition, contentWidth, 10, 'F');
            
            pdf.setFontSize(16);
            pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            pdf.text('Suas Intenções de Implementação', margin + 5, yPosition + 7);
            yPosition += 15;

            intentions.forEach((intention, index) => {
                addPageIfNeeded(25);

                // Card para cada intenção
                pdf.setFillColor(252, 252, 252);
                pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 0.3);
                pdf.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'FD');

                // Construir texto da intenção
                let intentionText = `Quando ${intention.situation}, eu farei ${intention.behavior}`;
                if (intention.time || intention.location) {
                    intentionText += ' ';
                    if (intention.time) intentionText += `às ${intention.time}`;
                    if (intention.time && intention.location) intentionText += ' ';
                    if (intention.location) intentionText += `em ${intention.location}`;
                }
                intentionText += '.'

                // Quebrar texto em linhas
                pdf.setFontSize(10);
                pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
                const splitText = pdf.splitTextToSize(intentionText, contentWidth - 10);
                pdf.text(splitText, margin + 5, yPosition + 8);

                yPosition += 25;
            });
        }

        // Adicionar seção de empilhamento de hábitos
        function addStackingSection() {
            if (stackings.length === 0) return;
            
            addPageIfNeeded(30);
            
            pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2], 0.1);
            pdf.rect(margin, yPosition, contentWidth, 10, 'F');
            
            pdf.setFontSize(16);
            pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            pdf.text('Seus Empilhamentos de Hábitos', margin + 5, yPosition + 7);
            yPosition += 15;

            stackings.forEach((stacking, index) => {
                addPageIfNeeded(20);

                // Card para cada empilhamento
                pdf.setFillColor(252, 252, 252);
                pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.3);
                pdf.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'FD');

                // Texto do empilhamento
                pdf.setFontSize(10);
                pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
                const stackingText = `Depois de ${stacking.currentHabit}, eu irei ${stacking.newHabit}.`;
                const splitText = pdf.splitTextToSize(stackingText, contentWidth - 10);
                pdf.text(splitText, margin + 5, yPosition + 8);

                yPosition += 20;
            });
        }

        // Adicionar seção de empacotamento de tentação
        function addBundlingSection() {
            if (bundlings.length === 0) return;
            
            addPageIfNeeded(30);
            
            pdf.setFillColor(successColor[0], successColor[1], successColor[2], 0.1);
            pdf.rect(margin, yPosition, contentWidth, 10, 'F');
            
            pdf.setFontSize(16);
            pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
            pdf.text('Seus Empacotamentos de Tentação', margin + 5, yPosition + 7);
            yPosition += 15;

            bundlings.forEach((bundling, index) => {
                addPageIfNeeded(20);

                // Card para cada empacotamento
                pdf.setFillColor(252, 252, 252);
                pdf.setDrawColor(successColor[0], successColor[1], successColor[2], 0.3);
                pdf.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'FD');

                // Texto do empacotamento
                pdf.setFontSize(10);
                pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
                const bundlingText = `Depois de ${bundling.needHabit}, eu vou ${bundling.wantHabit}.`;
                const splitText = pdf.splitTextToSize(bundlingText, contentWidth - 10);
                pdf.text(splitText, margin + 5, yPosition + 8);

                yPosition += 20;
            });
        }

        // Verificar se há dados para incluir no PDF
        const hasData = habits.length > 0 || intentions.length > 0 || 
                        stackings.length > 0 || bundlings.length > 0;

        if (!hasData) {
            // Se não houver dados, mostrar mensagem no PDF
            pdf.setFontSize(16);
            pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
            pdf.text('Nenhum dado encontrado', pageWidth / 2, pageHeight / 2, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text('Adicione hábitos, intenções, empilhamentos ou empacotamentos', 
                    pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
            pdf.text('para visualizá-los neste relatório.', 
                    pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
        } else {
            // Gerar o PDF com os dados do usuário - mais objetivo e direto
            addHeader();
            addHabitsSection();
            addIntentionsSection();
            addStackingSection();
            addBundlingSection();
            addFooter();
        }

        // Salvar o PDF
        pdf.save('habitos-atomicos-ferramentas.pdf');
        
        // Remover mensagem de carregamento
        loadingMessage.remove();
        
        // Mostrar mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'pdf-success';
        successMessage.innerHTML = `
            <div class="pdf-success-content">
                <i class="fas fa-check-circle"></i>
                <p>PDF gerado com sucesso!</p>
                <button class="btn-primary close-message">Fechar</button>
            </div>
        `;
        document.body.appendChild(successMessage);
        
        // Adicionar evento para fechar a mensagem
        successMessage.querySelector('.close-message').addEventListener('click', function() {
            successMessage.remove();
        });
        
        // Fechar automaticamente após 5 segundos
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                successMessage.remove();
            }
        }, 5000);
    }
}

// Adicionar evento ao botão para gerar PDF na página de ferramentas
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de ferramentas
    const pdfButton = document.getElementById('generate-pdf-btn');
    
    if (pdfButton) {
        pdfButton.addEventListener('click', generateToolsPDF);
    }
});

// Adicionar estilos para as mensagens de carregamento e sucesso
const style = document.createElement('style');
style.textContent = `
    .pdf-loading, .pdf-success {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .pdf-loading-content, .pdf-success-content {
        background-color: white;
        padding: 20px 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .pdf-loading i, .pdf-success i {
        font-size: 2rem;
        margin-bottom: 10px;
        display: block;
    }
    
    .pdf-loading i {
        color: #4361ee;
    }
    
    .pdf-success i {
        color: #4cc9f0;
    }
    
    .close-message {
        margin-top: 15px;
    }
    
    .pdf-button {
        margin-left: 10px;
    }
`;
document.head.appendChild(style);