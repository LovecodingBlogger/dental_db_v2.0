PGDMP     9        	             x            dental_dashboard    11.4    11.4     '           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            (           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            )           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            *           1262    25057    dental_dashboard    DATABASE     �   CREATE DATABASE dental_dashboard WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Thai_Thailand.874' LC_CTYPE = 'Thai_Thailand.874';
     DROP DATABASE dental_dashboard;
             bhqmetroddb    false            �            1259    25058    masterResource    TABLE     �   CREATE TABLE public."masterResource" (
    "resourceId" text NOT NULL,
    "resourceName" text NOT NULL,
    "createDate" timestamp without time zone,
    "updateDate" timestamp without time zone
);
 $   DROP TABLE public."masterResource";
       public         postgres    false            $          0    25058    masterResource 
   TABLE DATA               d   COPY public."masterResource" ("resourceId", "resourceName", "createDate", "updateDate") FROM stdin;
    public       postgres    false    196   �       $   �   x��̽
�0@�9y�<��Dc��.:h�Z���ܩ:TEҷ�} ����O8�9���ڦ�.w�<���p�t�b"N|�(̓0�ZY�HT��de]�Ce��N���#5��в�OJ4�Y�.8ٵ؏��ߢ�t�h�7��<��q��m/�	OG�ErA�˼N,p2�_Q�8�,���/7�]k     