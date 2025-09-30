import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

export const mockProperties = [
  {
    id: "1",
    image: property1,
    title: "Apartamento Moderno no Centro",
    price: 850000,
    neighborhood: "Centro",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    area: 120,
    description:
      "Apartamento completamente reformado com acabamento de primeira linha. Localização privilegiada no coração do centro da cidade, próximo a comércios, restaurantes e transporte público.",
    features: [
      "Varanda gourmet",
      "Piso em porcelanato",
      "Cozinha planejada",
      "Aquecimento central",
      "Vista panorâmica",
    ],
    realEstate: {
      name: "Imobiliária Premium",
      logo: "IP",
      phone: "(11) 98765-4321",
      email: "contato@premium.com.br",
    },
  },
  {
    id: "2",
    image: property2,
    title: "Casa com Jardim Espaçoso",
    price: 1250000,
    neighborhood: "Jardim Europa",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 3,
    area: 280,
    description:
      "Casa térrea ampla com jardim bem cuidado. Perfeita para famílias que buscam conforto e espaço. Área de lazer completa com churrasqueira e piscina.",
    features: [
      "Piscina aquecida",
      "Churrasqueira",
      "Jardim amplo",
      "Área de serviço",
      "Quintal espaçoso",
    ],
    realEstate: {
      name: "Imobiliária Casa & Cia",
      logo: "CC",
      phone: "(11) 91234-5678",
      email: "contato@casacia.com.br",
    },
  },
  {
    id: "3",
    image: property3,
    title: "Sala Comercial Premium",
    price: 650000,
    neighborhood: "Vila Olímpia",
    type: "Sala Comercial",
    area: 85,
    description:
      "Sala comercial em edifício corporativo AAA. Infraestrutura completa com ar-condicionado central, internet de alta velocidade e segurança 24h.",
    features: [
      "Ar-condicionado central",
      "Elevadores modernos",
      "Segurança 24h",
      "Estacionamento rotativo",
      "Próximo ao metrô",
    ],
    realEstate: {
      name: "Imobiliária Corporativa",
      logo: "IC",
      phone: "(11) 99876-5432",
      email: "contato@corporativa.com.br",
    },
  },
  {
    id: "4",
    image: property4,
    title: "Cobertura com Vista Panorâmica",
    price: 2100000,
    neighborhood: "Moema",
    type: "Apartamento",
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 4,
    area: 320,
    description:
      "Cobertura duplex com vista deslumbrante da cidade. Acabamento de luxo com materiais importados. Terraço com piscina privativa e espaço gourmet completo.",
    features: [
      "Piscina privativa",
      "Terraço gourmet",
      "Vista panorâmica",
      "Suíte master",
      "Closet",
      "Sala de cinema",
    ],
    realEstate: {
      name: "Imobiliária Premium",
      logo: "IP",
      phone: "(11) 98765-4321",
      email: "contato@premium.com.br",
    },
  },
];
