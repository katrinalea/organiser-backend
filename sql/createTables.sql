DROP TABLE IF EXISTS todolist;

create table toDo (
  id serial,
  message text not null,
  date DATE,
  completed boolean );
  
  insert into toDo (message, completed) values ('hello tester', false);



DROP TABLE IF EXISTS phonebook;

create table phonebook (
  id serial,
  first_name text,
  second_name text,
  phonenumber varchar(10)

);
insert into
  phonebook (first_name, second_name, phonenumber)
values
  ('katrina', 'woolley', '1234567893')

DROP TABLE IF EXISTS addressbook;
create table addressbook (
  id serial,
  first_name text,
  second_name text,
  street_name text,
  house_number varchar(10),
  postcode varchar(8),
  town text
);

insert into addressbook (first_name, second_name, street_name, house_number, postcode, town)
values ('katrina', 'woolley', 'seabank road', '23', 'ch44 0ee', 'wallasey')


  
  DROP TABLE IF EXISTS notes;
  create table notes (
    id serial,
    title text,
    message text not null )