import { localeInterface } from "./localeInterface"

const locale_pt_br: localeInterface = {
  locale: "pt-BR",
  frontpage: {
    welcome: "Bem-vindo ao Broadcast Box",
    welcome_subtitle: "O Broadcast Box é uma ferramenta que permite transmitir vídeo de alta qualidade em tempo real com máxima eficiência, utilizando os mais modernos codecs de vídeo e tecnologia WebRTC.",

    toggle_watch: "Quero assistir",
    toggle_stream: "Quero transmitir",

    stream_input_label: "Chave da transmissão",
    stream_input_placeholder_share: "Insira a chave da transmissão que deseja compartilhar",
    stream_input_placeholder_join: "Insira a chave da transmissão que deseja assistir",

    stream_button_stream_start: "Iniciar transmissão",
    stream_button_stream_join: "Entrar na transmissão",
  },

  available_streams: {
    title: "Transmissões ao vivo",
    stream_join_message: "Clique em uma transmissão para assistir",
    no_streams_message: "Nenhuma transmissão disponível no momento",
  },

  statistics: {
    title: "Estatísticas",
    no_statistics_available: "Nenhuma estatística disponível no momento",
    no_sessions: "Nenhuma sessão disponível",

    whep_sessions: "Sessões WHEP",

    video: "Vídeo",
    video_tracks: "Faixas de vídeo",
    video_track_not_available: "Sem faixas de vídeo",
    video_bitrate: "Taxa de bits (Bitrate)",
    video_bitrate_total_out: "Bitrate de saída",

    audio: "Áudio",
    audio_tracks: "Faixas de áudio",
    audio_track_not_available: "Sem faixas de áudio",

    button_watch_stream: "Assistir transmissão",

    rid: "RID",
    layer: "Camadas",
    packets_received: "Pacotes recebidos",
    packets_dropped: "Pacotes perdidos",
    packets_written: "Pacotes enviados",
    last_key_frame: "Último quadro-chave (Keyframe)",
    timestamp: "Timestamp",
    sequence_number: "Nº de sequência"
  },

  player_header: {
    error: "Erro",
    success: "Sucesso",
    warning: "Aviso",

    mediaAccessError_default: "Não foi possível acessar seus dispositivos de mídia",
    mediaAccessError_noMediaDevices: "API MediaDevices não encontrada. Transmitir no Broadcast Box requer HTTPS",
    mediaAccessError_notAllowedError: "Você não pode transmitir usando sua câmera, o acesso foi desativado.",
    mediaAccessError_notFoundError: "Parece que você não possui uma câmera ou o acesso está bloqueado.\nVerifique as configurações da câmera, permissões do navegador e do sistema operacional.",

    connection_established: "Ao vivo: Transmitindo para",
    connection_disconnected: "O WebRTC foi desconectado ou não conseguiu se conectar",
    connection_failed: "Falha ao iniciar a sessão do Broadcast Box",
    connection_has_packetloss: "O WebRTC está com perda de pacotes",

    publish_screen: "Transmitir Tela/Janela/Aba",
    publish_webcam: "Transmitir Webcam",

    button_end_stream: "Encerrar transmissão"
  },

  player_page: {
    cinema_mode_disable: "Desativar modo cinema",
    cinema_mode_enable: "Ativar modo cinema",

    modal_add_stream_title: "Adicionar transmissão",
    modal_add_stream_message: "Insira a chave da transmissão para adicionar à visualização múltipla",
    modal_add_stream_placeholder: "Digite a chave da transmissão que deseja adicionar",
  },

  player: {
    message_is_not_online: "não está transmitindo no momento",
    message_loading_video: "Carregando vídeo",
    message_error: "Erro ao carregar o vídeo",

    stream_status_offline: "Offline"
  },

  stream_status: {
    message_current_viewers: "Espectadores atuais"
  },

  profile_settings: {
    title: "Configurações do Perfil",
    subTitle: "Configure seu perfil de transmissão",

    toggle_stream_privacy_label: "Privacidade",
    toggle_stream_privacy_title_left: "Privado",
    toggle_stream_privacy_title_right: "Público",

    input_motd_label: "Mensagem do Dia (MOTD)",
    button_save_label: "Salvar"
  },

  admin_login: {
    login_input_dialog_title: "Acesso Administrativo",
    login_input_dialog_message: "Insira o token de administrador para fazer login",
    login_input_dialog_placeholder: "Token de administrador",
    error_message_login_failed: "Falha na autenticação",

    button_login_text: "Entrar"
  },

  admin_page: {
    title: "Portal de Administração",
    menu_api: "API",
    menu_logging: "Logs",
    menu_logout: "Sair",
    menu_profiles: "Perfis",
    menu_settings: "Aparência",
    menu_status: "Status"
  },

  admin_page_api: {
    title: "Configurações da API",
    table_header_setting_name: "Configuração",
    table_header_value: "Valor"
  },

  admin_page_logging: {
    title: "Logs do Sistema",
    table_header_setting_name: "Configuração",
    table_header_value: "Valor"
  },

  admin_page_profiles: {
    title: "Visão Geral dos Perfis",

    add_profile_modal_title: "Adicionar Perfil",
    add_profile_modal_message: "Insira uma chave para criar um novo canal/transmissão",
    add_profile_modal_placeholder: "Digite a chave da transmissão aqui",

    remove_profile_modal_title: "Remover Perfil",
    remove_profile_modal_message: "Tem certeza de que deseja remover",

    table_header_stream_key: "Chave do Canal",
    table_header_is_public: "Público",
    table_header_motd: "Mensagem (MOTD)",
    table_header_token: "Token",

    button_add_profile: "Adicionar Perfil",

    yes: "Sim",
    no: "Não"
  },

  admin_page_status_page: {
    title: "Status das Transmissões",

    table_header_stream_key: "Chave",
    table_header_is_public: "Público",
    table_header_video_tracks: "Faixas de Vídeo",
    table_header_audio_tracks: "Faixas de Áudio",
    table_header_sessions: "Sessões",
    table_header_total_packets: "Total de Pacotes",

    yes: "Sim",
    no: "Não"
  },

  shared_component_card: {
    button_accept: "Aceitar"
  },
  shared_component_text_input_modal: {
    button_accept: "Aceitar"
  },
  shared_component_text_input_dialog: {
    button_accept: "Aceitar"
  },

  chat: {
    title: "Chat",
    placeholder_input: "Digite uma mensagem...",
    button_reaction_title: "Enviar reação",
    button_change_display_name_title: "Alterar nome de exibição",
    button_send_title: "Enviar mensagem",
    status_connecting: "conectando",
    status_connected: "conectado",
    status_error: "erro",
    status_disconnected: "desconectado",
    no_messages_yet: "Nenhuma mensagem no chat ainda.",
    error_failed_to_connect: "Falha ao conectar ao chat",
    error_not_connected: "O chat não está conectado",
    error_failed_to_send: "Falha ao enviar mensagem",
    modal_display_name_title: "Nome de Exibição",
    modal_display_name_message: "Defina seu nome de exibição para o chat",
    modal_display_name_placeholder: "Digite seu nome no chat",
  },
}

export default locale_pt_br
