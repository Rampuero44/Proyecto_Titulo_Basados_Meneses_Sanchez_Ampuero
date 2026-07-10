-- ============================================================================
-- SCRIPT DE BASE DE DATOS - Creación del esquema
-- Proyecto: Organizador de asados / comparador de precios de supermercados
-- ============================================================================
-- Este script se generó a partir de un export de esquema de Supabase que
-- venía marcado como "solo para contexto, no ejecutable". Se corrigió y
-- completó para que se pueda correr de principio a fin en una base de datos
-- PostgreSQL vacía. Cambios respecto al archivo original:
--
--   1. Se agregó la extensión pgcrypto (requerida por gen_random_uuid() en
--      versiones de PostgreSQL anteriores a la 13).
--   2. Se crearon explícitamente todas las secuencias (CREATE SEQUENCE) que
--      las columnas usaban vía nextval('...') pero que no estaban definidas
--      en el archivo original.
--   3. Se reordenó la tabla "tipos": en el original se definía después de
--      "productos", pero productos.id_tipo la referencia mediante una
--      llave foránea, lo que producía un error de ejecución ("relation
--      tipos does not exist"). Ahora "tipos" se crea antes que "productos".
--   4. Se agregó ALTER SEQUENCE ... OWNED BY para vincular cada secuencia
--      a su columna (buena práctica: si se elimina la tabla, se elimina
--      también la secuencia).
--
-- Todo el resto de la estructura (nombres de tablas, columnas, tipos de
-- datos, valores por defecto, llaves primarias y foráneas) se mantuvo
-- exactamente igual al archivo original.
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. usuarios
CREATE TABLE public.usuarios (
  nombre character varying NOT NULL,
  apellido character varying,
  correo character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  telefono character varying,
  rol character varying DEFAULT 'PARTICIPANTE'::character varying,
  activo boolean DEFAULT true,
  fecha_eliminacion timestamp without time zone,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  ultimo_login timestamp without time zone,
  id_usuario uuid NOT NULL DEFAULT gen_random_uuid(),
  ia_tokens_consumidos integer NOT NULL DEFAULT 0,
  ia_fecha_reset date,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario)
);

-- 2. categorias_producto
CREATE SEQUENCE IF NOT EXISTS categorias_producto_id_categoria_seq;

CREATE TABLE public.categorias_producto (
  id_categoria bigint NOT NULL DEFAULT nextval('categorias_producto_id_categoria_seq'::regclass),
  nombre character varying NOT NULL,
  descripcion character varying,
  slug character varying UNIQUE,
  CONSTRAINT categorias_producto_pkey PRIMARY KEY (id_categoria)
);

ALTER SEQUENCE categorias_producto_id_categoria_seq OWNED BY public.categorias_producto.id_categoria;

-- 3. marcas
CREATE SEQUENCE IF NOT EXISTS marcas_id_marca_seq;

CREATE TABLE public.marcas (
  id_marca bigint NOT NULL DEFAULT nextval('marcas_id_marca_seq'::regclass),
  nombre character varying NOT NULL UNIQUE,
  CONSTRAINT marcas_pkey PRIMARY KEY (id_marca)
);

ALTER SEQUENCE marcas_id_marca_seq OWNED BY public.marcas.id_marca;

-- 4. formatos
CREATE SEQUENCE IF NOT EXISTS formatos_id_formato_seq;

CREATE TABLE public.formatos (
  id_formato bigint NOT NULL DEFAULT nextval('formatos_id_formato_seq'::regclass),
  nombre character varying NOT NULL,
  peso_gramos numeric,
  unidad character varying DEFAULT 'g'::character varying,
  CONSTRAINT formatos_pkey PRIMARY KEY (id_formato)
);

ALTER SEQUENCE formatos_id_formato_seq OWNED BY public.formatos.id_formato;

-- 5. comercios
CREATE SEQUENCE IF NOT EXISTS comercios_id_comercio_seq;

CREATE TABLE public.comercios (
  id_comercio bigint NOT NULL DEFAULT nextval('comercios_id_comercio_seq'::regclass),
  nombre character varying NOT NULL,
  url character varying,
  logo_url character varying,
  latitud numeric,
  longitud numeric,
  activo boolean DEFAULT true,
  fecha_eliminacion timestamp without time zone,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  url_base character varying,
  CONSTRAINT comercios_pkey PRIMARY KEY (id_comercio)
);

ALTER SEQUENCE comercios_id_comercio_seq OWNED BY public.comercios.id_comercio;

-- 6. tipos  (reordenada: debe existir antes que productos)
CREATE SEQUENCE IF NOT EXISTS tipos_id_tipo_seq;

CREATE TABLE public.tipos (
  id_tipo integer NOT NULL DEFAULT nextval('tipos_id_tipo_seq'::regclass),
  nombre character varying NOT NULL,
  id_categoria bigint NOT NULL,
  CONSTRAINT tipos_pkey PRIMARY KEY (id_tipo),
  CONSTRAINT tipos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias_producto(id_categoria)
);

ALTER SEQUENCE tipos_id_tipo_seq OWNED BY public.tipos.id_tipo;

-- 7. productos
CREATE SEQUENCE IF NOT EXISTS productos_id_producto_seq;

CREATE TABLE public.productos (
  id_producto bigint NOT NULL DEFAULT nextval('productos_id_producto_seq'::regclass),
  nombre character varying NOT NULL,
  descripcion character varying,
  id_categoria bigint NOT NULL,
  id_marca bigint,
  id_formato bigint,
  calorias numeric,
  proteinas numeric,
  grasas numeric,
  carbohidratos numeric,
  imagen_url character varying,
  alcoholico boolean DEFAULT false,
  activo boolean DEFAULT true,
  fecha_eliminacion timestamp without time zone,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  sku_scraping character varying UNIQUE,
  url_imagen_original character varying,
  fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  enriquecido boolean DEFAULT false,
  id_tipo bigint,
  cantidad_pack integer,
  enriquecimiento_exitoso boolean,
  CONSTRAINT productos_pkey PRIMARY KEY (id_producto),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES public.categorias_producto(id_categoria),
  CONSTRAINT fk_producto_marca FOREIGN KEY (id_marca) REFERENCES public.marcas(id_marca),
  CONSTRAINT fk_producto_formato FOREIGN KEY (id_formato) REFERENCES public.formatos(id_formato),
  CONSTRAINT productos_id_tipo_fkey FOREIGN KEY (id_tipo) REFERENCES public.tipos(id_tipo)
);

ALTER SEQUENCE productos_id_producto_seq OWNED BY public.productos.id_producto;

-- 8. historial_precios
CREATE SEQUENCE IF NOT EXISTS historial_precios_id_historial_seq;

CREATE TABLE public.historial_precios (
  id_historial bigint NOT NULL DEFAULT nextval('historial_precios_id_historial_seq'::regclass),
  id_producto bigint NOT NULL,
  id_comercio bigint NOT NULL,
  precio numeric NOT NULL,
  precio_oferta numeric,
  stock integer,
  url_producto character varying,
  fecha_scraping timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  precio_unitario character varying,
  disponible boolean DEFAULT true,
  CONSTRAINT historial_precios_pkey PRIMARY KEY (id_historial),
  CONSTRAINT fk_historial_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto),
  CONSTRAINT fk_historial_comercio FOREIGN KEY (id_comercio) REFERENCES public.comercios(id_comercio)
);

ALTER SEQUENCE historial_precios_id_historial_seq OWNED BY public.historial_precios.id_historial;

-- 9. eventos
CREATE TABLE public.eventos (
  nombre character varying NOT NULL,
  descripcion character varying,
  fecha_evento timestamp without time zone NOT NULL,
  direccion character varying,
  latitud numeric,
  longitud numeric,
  presupuesto numeric,
  cantidad_personas integer,
  estado character varying DEFAULT 'PLANIFICACION'::character varying,
  activo boolean DEFAULT true,
  fecha_eliminacion timestamp without time zone,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id_evento uuid NOT NULL DEFAULT gen_random_uuid(),
  id_organizador uuid,
  id_usuario uuid,
  CONSTRAINT eventos_pkey PRIMARY KEY (id_evento),
  CONSTRAINT eventos_id_organizador_fkey FOREIGN KEY (id_organizador) REFERENCES public.usuarios(id_usuario),
  CONSTRAINT eventos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);

-- 10. evento_participantes
CREATE TABLE public.evento_participantes (
  rol character varying DEFAULT 'PARTICIPANTE'::character varying,
  aporte numeric DEFAULT 0,
  asistencia boolean DEFAULT true,
  fecha_union timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id_evento uuid,
  id_usuario uuid,
  id_evento_participante uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT evento_participantes_pkey PRIMARY KEY (id_evento_participante),
  CONSTRAINT evento_participantes_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento),
  CONSTRAINT evento_participantes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);

-- 11. evento_productos
CREATE TABLE public.evento_productos (
  id_producto bigint NOT NULL,
  cantidad numeric NOT NULL,
  seleccionado boolean DEFAULT true,
  id_historial bigint,
  id_evento uuid,
  id_evento_producto uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT evento_productos_pkey PRIMARY KEY (id_evento_producto),
  CONSTRAINT fk_evprod_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto),
  CONSTRAINT fk_evento_producto_historial FOREIGN KEY (id_historial) REFERENCES public.historial_precios(id_historial),
  CONSTRAINT evento_productos_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento)
);

-- 12. maestros_parrilleros
CREATE SEQUENCE IF NOT EXISTS maestros_parrilleros_id_maestro_seq;

CREATE TABLE public.maestros_parrilleros (
  id_maestro bigint NOT NULL DEFAULT nextval('maestros_parrilleros_id_maestro_seq'::regclass),
  descripcion character varying,
  experiencia_anos integer,
  valor_servicio numeric,
  latitud numeric,
  longitud numeric,
  disponibilidad boolean DEFAULT true,
  puntuacion numeric,
  id_usuario uuid,
  estado_solicitud character varying DEFAULT 'PENDIENTE'::character varying,
  CONSTRAINT maestros_parrilleros_pkey PRIMARY KEY (id_maestro),
  CONSTRAINT maestros_parrilleros_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);

ALTER SEQUENCE maestros_parrilleros_id_maestro_seq OWNED BY public.maestros_parrilleros.id_maestro;

-- 13. contratacion_asador
CREATE SEQUENCE IF NOT EXISTS contratacion_asador_id_contratacion_seq;

CREATE TABLE public.contratacion_asador (
  id_contratacion bigint NOT NULL DEFAULT nextval('contratacion_asador_id_contratacion_seq'::regclass),
  id_maestro bigint NOT NULL,
  fecha_contratacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  valor_acordado numeric,
  estado character varying DEFAULT 'PENDIENTE'::character varying,
  id_evento uuid,
  CONSTRAINT contratacion_asador_pkey PRIMARY KEY (id_contratacion),
  CONSTRAINT fk_contratacion_maestro FOREIGN KEY (id_maestro) REFERENCES public.maestros_parrilleros(id_maestro),
  CONSTRAINT contratacion_asador_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento)
);

ALTER SEQUENCE contratacion_asador_id_contratacion_seq OWNED BY public.contratacion_asador.id_contratacion;

-- 14. scraping_log
CREATE SEQUENCE IF NOT EXISTS scraping_log_id_log_seq;

CREATE TABLE public.scraping_log (
  id_log bigint NOT NULL DEFAULT nextval('scraping_log_id_log_seq'::regclass),
  id_comercio bigint,
  fecha_inicio timestamp without time zone,
  fecha_fin timestamp without time zone,
  productos_detectados integer,
  productos_actualizados integer,
  estado character varying,
  errores text,
  subcategoria character varying,
  paginas_scrapeadas integer DEFAULT 0,
  CONSTRAINT scraping_log_pkey PRIMARY KEY (id_log),
  CONSTRAINT fk_log_comercio FOREIGN KEY (id_comercio) REFERENCES public.comercios(id_comercio)
);

ALTER SEQUENCE scraping_log_id_log_seq OWNED BY public.scraping_log.id_log;

-- 15. cache_scraping
CREATE SEQUENCE IF NOT EXISTS cache_scraping_id_cache_seq;

CREATE TABLE public.cache_scraping (
  id_cache bigint NOT NULL DEFAULT nextval('cache_scraping_id_cache_seq'::regclass),
  id_producto bigint,
  id_comercio bigint,
  datos_json jsonb,
  fecha_cache timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion timestamp without time zone,
  estado character varying,
  CONSTRAINT cache_scraping_pkey PRIMARY KEY (id_cache),
  CONSTRAINT fk_cache_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto),
  CONSTRAINT fk_cache_comercio FOREIGN KEY (id_comercio) REFERENCES public.comercios(id_comercio)
);

ALTER SEQUENCE cache_scraping_id_cache_seq OWNED BY public.cache_scraping.id_cache;

-- 16. auditoria_usuarios
CREATE SEQUENCE IF NOT EXISTS auditoria_usuarios_id_auditoria_seq;

CREATE TABLE public.auditoria_usuarios (
  id_auditoria bigint NOT NULL DEFAULT nextval('auditoria_usuarios_id_auditoria_seq'::regclass),
  accion character varying,
  datos_anteriores jsonb,
  datos_nuevos jsonb,
  fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  usuario_responsable character varying,
  id_usuario uuid,
  CONSTRAINT auditoria_usuarios_pkey PRIMARY KEY (id_auditoria),
  CONSTRAINT auditoria_usuarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);

ALTER SEQUENCE auditoria_usuarios_id_auditoria_seq OWNED BY public.auditoria_usuarios.id_auditoria;

-- 17. auditoria_productos
CREATE SEQUENCE IF NOT EXISTS auditoria_productos_id_auditoria_seq;

CREATE TABLE public.auditoria_productos (
  id_auditoria bigint NOT NULL DEFAULT nextval('auditoria_productos_id_auditoria_seq'::regclass),
  id_producto bigint,
  accion character varying,
  datos_anteriores jsonb,
  datos_nuevos jsonb,
  fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  usuario_responsable character varying,
  CONSTRAINT auditoria_productos_pkey PRIMARY KEY (id_auditoria)
);

ALTER SEQUENCE auditoria_productos_id_auditoria_seq OWNED BY public.auditoria_productos.id_auditoria;

-- 18. auditoria_eventos
CREATE SEQUENCE IF NOT EXISTS auditoria_eventos_id_auditoria_seq;

CREATE TABLE public.auditoria_eventos (
  id_auditoria bigint NOT NULL DEFAULT nextval('auditoria_eventos_id_auditoria_seq'::regclass),
  accion character varying,
  datos_anteriores jsonb,
  datos_nuevos jsonb,
  fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  usuario_responsable character varying,
  id_evento uuid,
  CONSTRAINT auditoria_eventos_pkey PRIMARY KEY (id_auditoria),
  CONSTRAINT auditoria_eventos_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento)
);

ALTER SEQUENCE auditoria_eventos_id_auditoria_seq OWNED BY public.auditoria_eventos.id_auditoria;

-- 19. gastos_evento
CREATE TABLE public.gastos_evento (
  id_producto bigint NOT NULL,
  monto numeric,
  cantidad integer,
  fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id_evento uuid,
  id_gasto uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT gastos_evento_pkey PRIMARY KEY (id_gasto),
  CONSTRAINT fk_gasto_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto),
  CONSTRAINT gastos_evento_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento)
);

-- 20. ia_uso_invitados
CREATE TABLE public.ia_uso_invitados (
  ip character varying NOT NULL,
  fecha date NOT NULL,
  tokens_consumidos integer NOT NULL DEFAULT 0,
  CONSTRAINT ia_uso_invitados_pkey PRIMARY KEY (ip)
);

COMMIT;
