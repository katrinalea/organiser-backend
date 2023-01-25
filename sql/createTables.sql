DROP TABLE IF EXISTS todolist;

create table toDo (
  id serial,
  message text not null,
  date DATE,
  completed boolean );
  
  insert into toDo (message, completed) values ('hello tester', false);
