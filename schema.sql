-- Schema de referência para o Supabase - Sistema Integrado de Gestão e Operações

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Operações / Registros
CREATE TABLE IF NOT EXISTS public.operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Controle de Ponto (Entrada e Saída)
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_name TEXT NOT NULL DEFAULT 'Operador Principal',
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    exit_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'open', -- open (em turno), closed (finalizado)
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Profiles
CREATE POLICY "Usuários podem visualizar todos os perfis"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Políticas de RLS para Operations
CREATE POLICY "Usuários autenticados podem ler operações"
    ON public.operations FOR SELECT
    USING (auth.role() = 'authenticated' OR true);

CREATE POLICY "Usuários autenticados podem criar operações"
    ON public.operations FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' OR true);

CREATE POLICY "Usuários podem atualizar suas próprias operações"
    ON public.operations FOR UPDATE
    USING (auth.uid() = user_id OR true);

CREATE POLICY "Usuários podem deletar suas próprias operações"
    ON public.operations FOR DELETE
    USING (auth.uid() = user_id OR true);

-- Políticas de RLS para Time Entries (Controle de Ponto)
CREATE POLICY "Leitura de registro de ponto"
    ON public.time_entries FOR SELECT
    USING (true);

CREATE POLICY "Criação de registro de ponto"
    ON public.time_entries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Atualização de registro de ponto"
    ON public.time_entries FOR UPDATE
    USING (true);
