const ACS_BY_TEAM = {
  'ESF Centro I': { name: 'Mariana Alves', microarea: 'Microárea 01' },
  'ESF Centro II': { name: 'Camila Rodrigues', microarea: 'Microárea 11' },
  'ESF São Benedito': { name: 'João Pedro Santos', microarea: 'Microárea 02' },
  'ESF São Paulo': { name: 'Ana Paula Souza', microarea: 'Microárea 03' },
  'ESF Santa Terezinha': { name: 'Carlos Henrique Lima', microarea: 'Microárea 04' },
  'ESF Irmã Dulce': { name: 'Luciana Oliveira', microarea: 'Microárea 05' },
  'ESF Andaiá': { name: 'Rafael Mendes', microarea: 'Microárea 06' },
  'ESF Urbis II': { name: 'Beatriz Carvalho', microarea: 'Microárea 07' },
  'ESF Alto Maron': { name: 'Diego Ferreira', microarea: 'Microárea 08' },
  'ESF Lagoa das Flores': { name: 'Patrícia Costa', microarea: 'Microárea 09' },
  'ESF Patagônia': { name: 'Felipe Almeida', microarea: 'Microárea 10' },
  'ESF Urbis I': { name: 'Renata Martins', microarea: 'Microárea 12' },
  'ESF Alto do Morro': { name: 'Gustavo Nascimento', microarea: 'Microárea 13' },
  'ESF Maria Preta': { name: 'Jéssica Barbosa', microarea: 'Microárea 14' },
}

export const getAcsDetails = (team) => {
  if (team?.acsName && team?.microarea) {
    return { name: team.acsName, microarea: team.microarea }
  }

  const details = ACS_BY_TEAM[team?.name] || ACS_BY_TEAM[team?.label]
  return details || { name: 'Agente não identificado', microarea: 'Microárea não informada' }
}

export const getAcsDisplayName = (team) => {
  const { name, microarea } = getAcsDetails(team)
  return `ACS ${name} · ${microarea}`
}
