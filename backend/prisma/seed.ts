import { PrismaClient, Role, Status, Priority, Urgency, TicketStatus, SphereType, ArticleAudience, ArticleStatus, CommentType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados detinOS...');

  // 1. Criar Setores Internos
  console.log('🏢 Criando setores internos da OCA...');
  const rh = await prisma.department.upsert({
    where: { name: 'Recursos Humanos' },
    update: {},
    create: {
      name: 'Recursos Humanos',
      acronym: 'RH',
      head: 'Marta Dias',
      phoneExtension: '2001',
      status: Status.ATIVO,
    },
  });

  const atendimento = await prisma.department.upsert({
    where: { name: 'Atendimento ao Público' },
    update: {},
    create: {
      name: 'Atendimento ao Público',
      acronym: 'ATEND',
      head: 'Carlos Silva',
      phoneExtension: '2005',
      status: Status.ATIVO,
    },
  });

  const dti = await prisma.department.upsert({
    where: { name: 'Tecnologia da Informação' },
    update: {},
    create: {
      name: 'Tecnologia da Informação',
      acronym: 'DTI',
      head: 'Ricardo Santos',
      phoneExtension: '2099',
      status: Status.ATIVO,
    },
  });

  const gabinete = await prisma.department.upsert({
    where: { name: 'Gabinete / Direção' },
    update: {},
    create: {
      name: 'Gabinete / Direção',
      acronym: 'GAB',
      head: 'Ana Souza',
      phoneExtension: '2010',
      status: Status.ATIVO,
    },
  });

  // 2. Criar Órgãos Parceiros
  console.log('🏛️ Criando órgãos parceiros...');
  const detran = await prisma.partnerAgency.upsert({
    where: { name: 'Departamento Estadual de Trânsito' },
    update: {},
    create: {
      name: 'Departamento Estadual de Trânsito',
      acronym: 'Detran',
      sphere: SphereType.ESTADUAL,
      contact: '(68) 3211-1234',
      status: Status.ATIVO,
    },
  });

  const sefaz = await prisma.partnerAgency.upsert({
    where: { name: 'Secretaria da Fazenda' },
    update: {},
    create: {
      name: 'Secretaria da Fazenda',
      acronym: 'Sefaz',
      sphere: SphereType.ESTADUAL,
      contact: '(68) 3211-9999',
      status: Status.ATIVO,
    },
  });

  const saude = await prisma.partnerAgency.upsert({
    where: { name: 'Secretaria Estadual de Saúde' },
    update: {},
    create: {
      name: 'Secretaria Estadual de Saúde',
      acronym: 'Sesacre',
      sphere: SphereType.ESTADUAL,
      contact: '(68) 3215-5000',
      status: Status.ATIVO,
    },
  });

  // 3. Criar Categorias & Regras de SLA
  console.log('🏷️ Criando categorias de atendimento e SLAs...');
  const catRede = await prisma.category.upsert({
    where: { name: 'Internet / Rede' },
    update: {},
    create: {
      name: 'Internet / Rede',
      description: 'Problemas de conexão, lentidão na rede ou cabeamento',
      responsibleTeam: 'Infraestrutura e Redes',
      slaFirstResponseMin: 15,
      slaResolutionMin: 120,
      status: Status.ATIVO,
    },
  });

  const catEquipamento = await prisma.category.upsert({
    where: { name: 'Computador / Equipamento' },
    update: {},
    create: {
      name: 'Computador / Equipamento',
      description: 'Falhas de hardware, lentidão no PC ou periféricos',
      responsibleTeam: 'Suporte N1 / Manutenção',
      slaFirstResponseMin: 30,
      slaResolutionMin: 240,
      status: Status.ATIVO,
    },
  });

  const catImpressora = await prisma.category.upsert({
    where: { name: 'Impressora' },
    update: {},
    create: {
      name: 'Impressora',
      description: 'Atolamento de papel, falta de toner ou erro de driver',
      responsibleTeam: 'Suporte N1',
      slaFirstResponseMin: 30,
      slaResolutionMin: 180,
      status: Status.ATIVO,
    },
  });

  const catSistemas = await prisma.category.upsert({
    where: { name: 'Sistemas Internos' },
    update: {},
    create: {
      name: 'Sistemas Internos',
      description: 'Instabilidade em sistemas como SEI, RH, Folha ou ERP',
      responsibleTeam: 'Desenvolvimento e Sistemas',
      slaFirstResponseMin: 60,
      slaResolutionMin: 480,
      status: Status.ATIVO,
    },
  });

  const catAcessos = await prisma.category.upsert({
    where: { name: 'Solicitação de Acesso / Senha' },
    update: {},
    create: {
      name: 'Solicitação de Acesso / Senha',
      description: 'Reset de senha de rede, criação de usuários ou permissões',
      responsibleTeam: 'Segurança e Acessos',
      slaFirstResponseMin: 20,
      slaResolutionMin: 60,
      status: Status.ATIVO,
    },
  });

  // 4. Criar Usuários Padrão (Admin, Gestor, Técnico, Solicitante)
  console.log('👤 Criando usuários...');
  const defaultPasswordHash = await bcrypt.hash('senha123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@detinos.local' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@detinos.local',
      name: 'Administrador do Sistema',
      password: adminPasswordHash,
      role: Role.ADMIN,
      contact: '(68) 99999-1000',
      departmentId: dti.id,
      status: Status.ATIVO,
    },
  });

  const gestor = await prisma.user.upsert({
    where: { email: 'coordenador@detinos.local' },
    update: {},
    create: {
      username: 'coordenador',
      email: 'coordenador@detinos.local',
      name: 'Ricardo Santos (Coordenador DTI)',
      password: defaultPasswordHash,
      role: Role.GESTOR,
      contact: '(68) 99999-2000',
      departmentId: dti.id,
      status: Status.ATIVO,
    },
  });

  const tecnico = await prisma.user.upsert({
    where: { email: 'roberto.ti@detinos.local' },
    update: {},
    create: {
      username: 'roberto.ti',
      email: 'roberto.ti@detinos.local',
      name: 'Roberto TI',
      password: defaultPasswordHash,
      role: Role.TECNICO,
      contact: '(68) 99999-3000',
      departmentId: dti.id,
      status: Status.ATIVO,
    },
  });

  const usuario = await prisma.user.upsert({
    where: { email: 'joao.silva@detinos.local' },
    update: {},
    create: {
      username: 'joao.silva',
      email: 'joao.silva@detinos.local',
      name: 'João Silva',
      password: defaultPasswordHash,
      role: Role.USUARIO_COMUM,
      contact: '(68) 99999-4000',
      departmentId: rh.id,
      status: Status.ATIVO,
    },
  });

  const usuarioParceiro = await prisma.user.upsert({
    where: { email: 'maria.silva@detran.local' },
    update: {},
    create: {
      username: 'maria.silva',
      email: 'maria.silva@detran.local',
      name: 'Maria Silva (Detran)',
      password: defaultPasswordHash,
      role: Role.USUARIO_COMUM,
      contact: '(68) 99999-5000',
      partnerAgencyId: detran.id,
      status: Status.ATIVO,
    },
  });

  // 5. Criar Chamados de Demonstração
  console.log('🎫 Criando chamados de teste...');
  const ticket1 = await prisma.ticket.upsert({
    where: { protocol: '2026-0001' },
    update: {},
    create: {
      protocol: '2026-0001',
      title: 'Sistema SEI fora do ar',
      description: 'O sistema SEI parou de funcionar de repente. Ao tentar logar, recebo a mensagem "Erro 502 Bad Gateway".',
      status: TicketStatus.EM_ANDAMENTO,
      priority: Priority.CRITICA,
      urgency: Urgency.CRITICA,
      location: 'Bloco A, 1º Andar, Mesa 05',
      contact: '(68) 99999-5000',
      authorId: usuarioParceiro.id,
      assigneeId: tecnico.id,
      departmentId: gabinete.id,
      partnerAgencyId: detran.id,
      categoryId: catSistemas.id,
      slaFirstResponseAt: new Date(Date.now() + 15 * 60 * 1000),
      slaResolutionAt: new Date(Date.now() + 45 * 60 * 1000),
      firstRespondedAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        ticketId: ticket1.id,
        authorId: usuarioParceiro.id,
        type: CommentType.USER,
        content: 'O sistema SEI parou de funcionar de repente. Ao tentar logar, recebo a mensagem "Erro 502 Bad Gateway". Precisamos de acesso urgente para despachar processos importantes que vencem hoje.',
        isInternal: false,
      },
      {
        ticketId: ticket1.id,
        authorId: null,
        type: CommentType.SYSTEM,
        content: 'Chamado criado e classificado com prioridade Crítica.',
        isInternal: false,
      },
      {
        ticketId: ticket1.id,
        authorId: tecnico.id,
        type: CommentType.TECH,
        content: 'Bom dia Maria, estamos verificando o problema junto à equipe de infraestrutura. Retornamos em breve.',
        isInternal: false,
      },
    ],
    skipDuplicates: true,
  });

  const ticket2 = await prisma.ticket.upsert({
    where: { protocol: '2026-0002' },
    update: {},
    create: {
      protocol: '2026-0002',
      title: 'Rede caindo constantemente nos guichês',
      description: 'Oscilação constante na conexão de rede dos guichês 10 a 14.',
      status: TicketStatus.NOVO,
      priority: Priority.ALTA,
      urgency: Urgency.ALTA,
      location: 'Térreo, Guichês 10 a 14',
      contact: '(68) 99999-4000',
      authorId: usuario.id,
      departmentId: atendimento.id,
      categoryId: catRede.id,
      slaFirstResponseAt: new Date(Date.now() + 30 * 60 * 1000),
      slaResolutionAt: new Date(Date.now() + 120 * 60 * 1000),
    },
  });

  // 6. Criar Artigos na Base de Conhecimento
  console.log('📚 Criando artigos da Base de Conhecimento...');
  await prisma.article.upsert({
    where: { slug: 'como-redefinir-sua-senha-da-rede' },
    update: {},
    create: {
      title: 'Como redefinir sua senha da rede',
      slug: 'como-redefinir-sua-senha-da-rede',
      excerpt: 'Passo a passo rápido para resetar a senha do Windows sem precisar abrir chamado.',
      content: 'Para resetar a senha do Windows no seu computador: 1. Pressione CTRL + ALT + DEL; 2. Selecione a opção Alterar Senha; 3. Insira sua senha antiga e digite a nova com no mínimo 8 caracteres.',
      categoryId: catAcessos.id,
      authorId: admin.id,
      audience: ArticleAudience.GERAL,
      status: ArticleStatus.PUBLICADO,
      views: 1245,
      usefulVotes: 98,
      notUsefulVotes: 2,
    },
  });

  await prisma.article.upsert({
    where: { slug: 'solucao-para-o-erro-502-no-sistema-sei' },
    update: {},
    create: {
      title: 'Solução para o Erro 502 no Sistema SEI',
      slug: 'solucao-para-o-erro-502-no-sistema-sei',
      excerpt: 'Se você encontrar o Erro 502 Bad Gateway ao acessar o SEI, limpe o cache do seu navegador.',
      content: 'Ao encontrar o erro 502 no SEI: 1. Pressione CTRL + F5 para recarregar limpando o cache; 2. Teste o acesso em uma janela anônima; 3. Caso o problema persista, verifique a conexão com o servidor proxy.',
      categoryId: catSistemas.id,
      authorId: tecnico.id,
      audience: ArticleAudience.GERAL,
      status: ArticleStatus.PUBLICADO,
      views: 890,
      usefulVotes: 85,
      notUsefulVotes: 5,
    },
  });

  await prisma.article.upsert({
    where: { slug: 'como-adicionar-impressora-padrao-setor' },
    update: {},
    create: {
      title: 'Como adicionar a Impressora Padrão no seu setor',
      slug: 'como-adicionar-impressora-padrao-setor',
      excerpt: 'Aprenda a mapear as impressoras de rede da OCA através do menu Dispositivos e Impressoras.',
      content: 'Para mapear a impressora do seu setor: 1. Abra o Executar (Win + R); 2. Digite \\\\printserver.oca; 3. Dê duplo clique na impressora do seu setor (ex: IMP_RH_01).',
      categoryId: catImpressora.id,
      authorId: tecnico.id,
      audience: ArticleAudience.GERAL,
      status: ArticleStatus.PUBLICADO,
      views: 532,
      usefulVotes: 92,
      notUsefulVotes: 1,
    },
  });

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
