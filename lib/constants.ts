export const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#planos', label: 'Planos' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#contato', label: 'Contato' },
]

export const SERVICES = [
  { id: 1, title: 'Corte', price: 35, icon: 'scissors' },
  { id: 2, title: 'Barba', price: 25, icon: 'beard' },
  { id: 3, title: 'Corte + Barba', price: 55, icon: 'combo' },
  { id: 4, title: 'Sobrancelha', price: 5, icon: 'eyebrow' },
  { id: 5, title: 'Pigmentação', price: 15, icon: 'pigment' },
  { id: 6, title: 'Pezinho', price: 15, icon: 'footline' },
  { id: 7, title: 'Corte + Sobrancelha', price: 40, icon: 'comboEyebrow' },
  { id: 8, title: 'Corte + Pigmentação', price: 50, icon: 'comboPigment' },
]

export const PLANS = [
  {
    id: 1,
    name: 'Bronze',
    price: 84.9,
    description: '4 cortes ou 4 barbas',
    validity: 'Válido por 30 dias',
  },
  {
    id: 2,
    name: 'Prata',
    price: 109.9,
    description: '4 cortes e 4 sobrancelhas',
    validity: 'Válido por 30 dias',
  },
  {
    id: 3,
    name: 'Ouro',
    price: 134.9,
    description: 'Cortes ilimitados e 4 barbas',
    validity: 'Válido por 30 dias',
    popular: true,
  },
  {
    id: 4,
    name: 'Prime',
    price: 159.9,
    description: 'Cortes ilimitados, barbas ilimitadas e serviços extras',
    validity: 'Válido por 30 dias',
  },
]

export const STATS = [
  { value: 200, label: 'Clientes Atendidos', suffix: '+' },
  { value: 2, label: 'Anos de Experiência', suffix: '' },
  { value: 100, label: 'Taxa de Satisfação', suffix: '%' },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ricardo Mendes',
    role: 'Empresário',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'O melhor barbeiro de São Paulo. Frequento há 3 anos e nunca me decepcionei. A atenção aos detalhes é impressionante.',
    rating: 5,
    date: '2 semanas atrás',
  },
  {
    id: 2,
    name: 'Lucas Ferreira',
    role: 'Advogado',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    content: 'Ambiente impecável, atendimento de primeira. Saio de lá sempre me sentindo uma pessoa nova. Recomendo demais!',
    rating: 5,
    date: '1 mês atrás',
  },
  {
    id: 3,
    name: 'André Santos',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'Procurava um lugar que entendesse o meu estilo. Encontrei no Miguelzin Du Corte. Agora não troco por nada.',
    rating: 5,
    date: '3 semanas atrás',
  },
  {
    id: 4,
    name: 'Felipe Oliveira',
    role: 'Médico',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    content: 'Profissionalismo exemplar. O Miguel tem uma técnica incrível e ainda faz uma ótima conversa. Top demais!',
    rating: 5,
    date: '1 semana atrás',
  },
  {
    id: 5,
    name: 'Gustavo Lima',
    role: 'Gerente Comercial',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    content: 'Finalmente encontrei um barbeiro que realmente entende de corte masculino moderno. Virei cliente fiel.',
    rating: 5,
    date: '2 meses atrás',
  },
]

export const GALLERY_IMAGES = [
  { id: 1, src: '/gallery/corte-1.jpg', alt: 'Degradê navalhado com cachos' },
  { id: 2, src: '/gallery/corte-2.jpg', alt: 'Degradê baixo com brinco' },
  { id: 3, src: '/gallery/corte-3.jpg', alt: 'Topete com desenho lateral' },
  { id: 4, src: '/gallery/corte-4.jpg', alt: 'Corte social com degradê' },
  { id: 5, src: '/gallery/corte-5.jpg', alt: 'Degradê com desenho na nuca' },
  { id: 6, src: '/gallery/corte-6.jpg', alt: 'Degradê com desenho personalizado' },
]

export const CONTACT_INFO = {
  address: 'Centro',
  city: 'Patos de Minas - MG',
  phone: '(62) 99523-0895',
  whatsapp: '5562995230895',
  email: 'contato@miguelzinducorte.com',
  instagram: 'miguelzinducorte',
  hours: {
    weekdays: 'Ter - Sáb: 9h às 20h',
    weekend: 'Domingo: 10h às 18h',
    closed: 'Segunda-feira: Fechado',
  },
  mapUrl: 'https://maps.google.com/?q=Patos+de+Minas+MG',
}

export const SOCIAL_LINKS = {
  instagram: `https://instagram.com/${CONTACT_INFO.instagram}`,
  whatsapp: CONTACT_INFO.whatsapp,
  email: CONTACT_INFO.email,
  facebook: `https://facebook.com/${CONTACT_INFO.instagram}`,
}
