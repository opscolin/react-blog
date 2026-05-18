

1、库和用户

```sql
postgres@[local]:5432=# \l
                                       List of databases
     Name      |   Owner    | Encoding |   Collate   |    Ctype    |     Access privileges
---------------+------------+----------+-------------+-------------+---------------------------
 colinspace    | kfz_djuser | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =Tc/kfz_djuser           +
               |            |          |             |             | kfz_readonly=c/kfz_djuser+
               |            |          |             |             | kfz_djuser=CTc/kfz_djuser
 db_colinops   | colinops   | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 personal_blog | postgres   | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =Tc/postgres             +
               |            |          |             |             | postgres=CTc/postgres    +
               |            |          |             |             | bloguser=CTc/postgres
```


2、备份

/usr/pgsql-14/bin/pg_dump  -U postgres -d personal_blog -f test-personal_blog.20260512.sql
/usr/pgsql-14/bin/pg_dump  -U postgres -d db_colinops -f test-db_colinops.20260512.sql
/usr/pgsql-14/bin/pg_dump  -U postgres -d colinspace -f test-colinspace.20260512.sql


```bash
# 基础备份（导出为 SQL 脚本）：
pg_dump -U postgres -d mydb -f mydb_backup.sql

# 推荐备份（自定义格式，自带压缩，支持并行）：
pg_dump -U postgres -d mydb -Fc -f mydb_backup.dump

# 并行备份（适合大库，仅目录格式 -Fd 支持）：
pg_dump -U postgres -d mydb -Fd -j 4 -f backup_directory/

# 备份所有数据库：
pg_dumpall -U postgres -f all_databases.sql
```


3、恢复

```bash
# 恢复整个数据库：
pg_restore -U postgres -d mydb -Fc mydb_backup.dump

# 只恢复某一张特定的表：
pg_restore -U postgres -d mydb -t users mydb_backup.dump

# 并行恢复（大幅提升大库恢复速度）：
pg_restore -U postgres -d mydb -j 4 mydb_backup.dump
```

4、账号

export DATABASE_URL='postgresql://bloguser:Blue2099&!og@192.168.3.108:5432/personal_blog'

