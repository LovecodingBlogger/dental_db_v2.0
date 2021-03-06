PGDMP     $                     x            dental_dashboard    11.4    11.4 *    F           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            G           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            H           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            I           1262    24926    dental_dashboard    DATABASE     �   CREATE DATABASE dental_dashboard WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Thai_Thailand.874' LC_CTYPE = 'Thai_Thailand.874';
     DROP DATABASE dental_dashboard;
             admin    false            �            1259    24933    masterResource    TABLE     �   CREATE TABLE public."masterResource" (
    "resourceId" text NOT NULL,
    "resourceName" text NOT NULL,
    "createDate" timestamp without time zone,
    "updateDate" timestamp without time zone
);
 $   DROP TABLE public."masterResource";
       public         postgres    false            �            1259    24927    masterService    TABLE     V   CREATE TABLE public."masterService" (
    "serviceId" text,
    "serviceName" text
);
 #   DROP TABLE public."masterService";
       public         admin    false            �            1259    24981    patientStatus    TABLE     S   CREATE TABLE public."patientStatus" (
    "statusId" text,
    description text
);
 #   DROP TABLE public."patientStatus";
       public         postgres    false            �            1259    25024    resourceSchedule_id_seq    SEQUENCE     �   CREATE SEQUENCE public."resourceSchedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."resourceSchedule_id_seq";
       public       admin    false            �            1259    25026    resourceSchedule    TABLE     �  CREATE TABLE public."resourceSchedule" (
    id bigint DEFAULT nextval('public."resourceSchedule_id_seq"'::regclass) NOT NULL,
    "resourceScheduleId" text,
    "patientId" text,
    "patientName" text,
    "dateAppointment" text,
    "timeAppointment" text,
    "episodeNumber" text,
    room text,
    "statusId" text,
    location text,
    "timeRegister" text,
    "serviceId" text,
    "resourceId" text
);
 &   DROP TABLE public."resourceSchedule";
       public         admin    false    208            �            1259    24993    resourceScheduleHistory_id_seq    SEQUENCE     �   CREATE SEQUENCE public."resourceScheduleHistory_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public."resourceScheduleHistory_id_seq";
       public       postgres    false            �            1259    25047    resourceScheduleHistory    TABLE     �  CREATE TABLE public."resourceScheduleHistory" (
    id bigint DEFAULT nextval('public."resourceScheduleHistory_id_seq"'::regclass) NOT NULL,
    "resourceScheduleId" text,
    "patientId" text,
    "patientName" text,
    "dateAppointment" text,
    "timeAppointment" text,
    "episodeNumber" text,
    room text,
    "statusId" text,
    location text,
    "timeRegister" text,
    "serviceId" text,
    "resourceId" text
);
 -   DROP TABLE public."resourceScheduleHistory";
       public         postgres    false    206            �            1259    25002    resourceScheduleTemp_id_seq    SEQUENCE     �   CREATE SEQUENCE public."resourceScheduleTemp_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public."resourceScheduleTemp_id_seq";
       public       admin    false            �            1259    25040    resourceScheduleTemp    TABLE     �  CREATE TABLE public."resourceScheduleTemp" (
    id bigint DEFAULT nextval('public."resourceScheduleTemp_id_seq"'::regclass) NOT NULL,
    "resourceScheduleId" text,
    "patientId" text,
    "patientName" text,
    "dateAppointment" text,
    "timeAppointment" text,
    "episodeNumber" text,
    room text,
    "statusId" text,
    location text,
    "timeRegister" text,
    "serviceId" text,
    "resourceId" text
);
 *   DROP TABLE public."resourceScheduleTemp";
       public         admin    false    207            �            1259    24956    resourceService    TABLE     o   CREATE TABLE public."resourceService" (
    id bigint NOT NULL,
    "resourceId" text,
    "serviceId" text
);
 %   DROP TABLE public."resourceService";
       public         postgres    false            �            1259    24954    resourceService_id_seq    SEQUENCE     �   CREATE SEQUENCE public."resourceService_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."resourceService_id_seq";
       public       postgres    false    201            J           0    0    resourceService_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."resourceService_id_seq" OWNED BY public."resourceService".id;
            public       postgres    false    200            �            1259    24947    resourceSlot    TABLE     �   CREATE TABLE public."resourceSlot" (
    id bigint NOT NULL,
    "dateSlot" text,
    "timeSlot" text,
    "resourceId" text
);
 "   DROP TABLE public."resourceSlot";
       public         postgres    false            �            1259    24945    resourceSlot_id_seq    SEQUENCE     ~   CREATE SEQUENCE public."resourceSlot_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."resourceSlot_id_seq";
       public       postgres    false    199            K           0    0    resourceSlot_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."resourceSlot_id_seq" OWNED BY public."resourceSlot".id;
            public       postgres    false    198            �            1259    24965 
   roomDetail    TABLE     �   CREATE TABLE public."roomDetail" (
    id bigint NOT NULL,
    room text,
    "assistantName" text,
    "scheduleTime" text,
    location text,
    "statusResource" text,
    "resourceId" text
);
     DROP TABLE public."roomDetail";
       public         admin    false            �            1259    24963    roomDetail_id_seq    SEQUENCE     |   CREATE SEQUENCE public."roomDetail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."roomDetail_id_seq";
       public       admin    false    203            L           0    0    roomDetail_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."roomDetail_id_seq" OWNED BY public."roomDetail".id;
            public       admin    false    202            �            1259    24987    users    TABLE     -   CREATE TABLE public.users (
    name text
);
    DROP TABLE public.users;
       public         admin    false            �
           2604    24959    resourceService id    DEFAULT     |   ALTER TABLE ONLY public."resourceService" ALTER COLUMN id SET DEFAULT nextval('public."resourceService_id_seq"'::regclass);
 C   ALTER TABLE public."resourceService" ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    200    201    201            �
           2604    24950    resourceSlot id    DEFAULT     v   ALTER TABLE ONLY public."resourceSlot" ALTER COLUMN id SET DEFAULT nextval('public."resourceSlot_id_seq"'::regclass);
 @   ALTER TABLE public."resourceSlot" ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    199    198    199            �
           2604    24968    roomDetail id    DEFAULT     r   ALTER TABLE ONLY public."roomDetail" ALTER COLUMN id SET DEFAULT nextval('public."roomDetail_id_seq"'::regclass);
 >   ALTER TABLE public."roomDetail" ALTER COLUMN id DROP DEFAULT;
       public       admin    false    203    202    203            5          0    24933    masterResource 
   TABLE DATA               d   COPY public."masterResource" ("resourceId", "resourceName", "createDate", "updateDate") FROM stdin;
    public       postgres    false    197   �/       4          0    24927    masterService 
   TABLE DATA               E   COPY public."masterService" ("serviceId", "serviceName") FROM stdin;
    public       admin    false    196   �0       <          0    24981    patientStatus 
   TABLE DATA               B   COPY public."patientStatus" ("statusId", description) FROM stdin;
    public       postgres    false    204   �0       A          0    25026    resourceSchedule 
   TABLE DATA               �   COPY public."resourceSchedule" (id, "resourceScheduleId", "patientId", "patientName", "dateAppointment", "timeAppointment", "episodeNumber", room, "statusId", location, "timeRegister", "serviceId", "resourceId") FROM stdin;
    public       admin    false    209   1       C          0    25047    resourceScheduleHistory 
   TABLE DATA               �   COPY public."resourceScheduleHistory" (id, "resourceScheduleId", "patientId", "patientName", "dateAppointment", "timeAppointment", "episodeNumber", room, "statusId", location, "timeRegister", "serviceId", "resourceId") FROM stdin;
    public       postgres    false    211   �1       B          0    25040    resourceScheduleTemp 
   TABLE DATA               �   COPY public."resourceScheduleTemp" (id, "resourceScheduleId", "patientId", "patientName", "dateAppointment", "timeAppointment", "episodeNumber", room, "statusId", location, "timeRegister", "serviceId", "resourceId") FROM stdin;
    public       admin    false    210   �1       9          0    24956    resourceService 
   TABLE DATA               J   COPY public."resourceService" (id, "resourceId", "serviceId") FROM stdin;
    public       postgres    false    201   �2       7          0    24947    resourceSlot 
   TABLE DATA               R   COPY public."resourceSlot" (id, "dateSlot", "timeSlot", "resourceId") FROM stdin;
    public       postgres    false    199   �2       ;          0    24965 
   roomDetail 
   TABLE DATA               {   COPY public."roomDetail" (id, room, "assistantName", "scheduleTime", location, "statusResource", "resourceId") FROM stdin;
    public       admin    false    203   K3       =          0    24987    users 
   TABLE DATA               %   COPY public.users (name) FROM stdin;
    public       admin    false    205   �3       M           0    0    resourceScheduleHistory_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public."resourceScheduleHistory_id_seq"', 22, true);
            public       postgres    false    206            N           0    0    resourceScheduleTemp_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public."resourceScheduleTemp_id_seq"', 55867, true);
            public       admin    false    207            O           0    0    resourceSchedule_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."resourceSchedule_id_seq"', 246, true);
            public       admin    false    208            P           0    0    resourceService_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."resourceService_id_seq"', 8, true);
            public       postgres    false    200            Q           0    0    resourceSlot_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."resourceSlot_id_seq"', 9, true);
            public       postgres    false    198            R           0    0    roomDetail_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."roomDetail_id_seq"', 153, true);
            public       admin    false    202            5   �   x��̽
�0@�9y�<�J~Ԫ�E�V���B�;��"����4���s^B_=��w#�һE@$�����'&�L�L���x���E%���׬�@�Z������~�JĩcQEj��Y�;.h�Z(�t,=�ͼ��g���z��Qn5�*q,�+n�̫e��v���I��>J���]      4   ?   x�3�|�c��h|�c����M`�|��L.#��9vv�š�v�<ر���)\1z\\\ �6-�      <   ;   x�3�t���NM�2�t,*�,��9�sr�S #/9�6�t�KQN-*�Lrc���� T      A   �   x���;�0��9E.P���t�*u�BըE� Q�޾V��X��O�me �Up]�f�8��fz��̑r�
�� �y݋
H(Õ��������ܹ։S�t5�ۉ*I� LH�Q�IF:�fa�(���aQQFq9�A�T��{y���}r>[��U��=|W��=�;>2!��N�      C      x������ � �      B   �   x���=�0���9E.@k;?��ڲ".�RD%j*U,ܞ�J%��[��{�jO@�H'j������a	aZ��ddr-Z ��==�#B�� ����s
���{�}���9q#}�����{�ɺ5�d�V�v�;�d5J�I�m��:��F���S���9�n�R���OV      9   *   x�3�4�4�2�F\��F@��4�2�4�-8M��=... g��      7   M   x�e��� �s�Ɇ�`-�_�b.��f(V�Lم~�
a�����Wh��:ʂy`���~{�#5��Xp X�       ;   >   x�345�44�,I-.Q�L��4��20�52 ��n9��E���y��\��ƜFF��q��qqq o��      =      x�K*�L�K�J�=���� Y�~     