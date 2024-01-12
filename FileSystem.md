---
outline: deep
---

# 目录结构

Linux系统中，所有数据都是以文件的形式呈现，整个系统是以`目录树`架构来组成。 目录树以根目录为主， 以"/"来表示


## 挂载
> 文件与目录树的关系

**挂载**其实是利用一个目录作为进入点，将磁盘分区的数据放置在该目录下。 整个Linux系统最重要的是根目录，所以根目录一定需要挂载一个分区中，其他目录可以按照需求挂载到其他目录。

![mount](https://cdn.jsdelivr.net/gh/GitHub-Stephen/blogPic/springboot/mount.png)

<br>

# 文件与目录配置

## 用户与用户组

- 文件拥有者

由于 Linux 是多人多任务的系统，因此可能会有多人同时使用这台机来进行工作，考虑到隐私和工作习惯，文件拥有者这个角色就非常重要了。
设定好合适的权限后，目录、文件的相关操作权限，就仅仅只能由文件拥有者所持有。

- 用户组

顾名思义，其实就是一个用户的集合，用户组内包含多个用户，用户组之间的权限相互独立。如项目组 A 掌控 文件夹 A, 项目组 B 掌握文件夹 B， 组 A 内部成员可修改文件夹A以及子文件夹的所有内容， 项目组 B 则**无权**访问文件夹 A, 假设有一个大项目经理 C ,TA 可以同时拥有文件夹A、B的权限，这时，用户组就可以灵活配置，满足需求了。


- 其他人

其他人则是除**文件拥有者**、**用户组中成员**之外的一个用户（账户），Linux 文件的权限由 owner、group、other组成，其他人就是相当于这个 other 了，权限的授予部分我们后续会介绍。


## 文件权限

### 文件属性

列出文件列表，我们可以使用 `ls -al` 命令，之后我们可以查看到：

```shell
[root@nano /]# ls -al
total 20
dr-xr-xr-x.  18 root root  236 Jan 31  2023 .
dr-xr-xr-x.  18 root root  236 Jan 31  2023 ..
lrwxrwxrwx.   1 root root    7 Jul 18  2018 bin -> usr/bin
dr-xr-xr-x.   5 root root 4096 Jan 31  2023 boot
drwxr-xr-x.   7 root root 4096 Nov  1 10:52 data
drwxr-xr-x.  21 root root 3200 Jan 31  2023 dev

```

这里我们可以分几个部分介绍，首先是整体：

![fileDescription](https://cdn.jsdelivr.net/gh/GitHub-Stephen/blogPic/springboot/fileDescription.png)

再来介绍**文档类型及权限**部分：

![20231201083836](https://cdn.jsdelivr.net/gh/GitHub-Stephen/blogPic/springboot/20231201083836.png)
*<center>截图自：鸟哥私房菜</center>*

以上部分其实由10个字符组成：
- 第一个字符是文件类型，其中包含：

    - `d` : 文件夹
    - `-` : 文件
    - `l` : 连接文件（后续介绍ln时会讲解）
    - `b` : 可供存储的接口设备
    - `c` : 串行设备，如键盘、鼠标

- 后面部分由 `rwx` 组合出现，出现三次，分别代表：

    - 文件拥有者的读、写、执行权
    - 文件所属用户组读、写、执行权限
    - 非拥有者、所属组的其他人的权限

`rwx` 的位置并不会改变，有权限则显示字母，没权限则显示 "-"

- 第二栏代表连接数，表明目前由多少个文件连接到文件系统中的同一个 `inode`上

- 第三栏代表文件拥有者
- 第四栏代表文件所属组
- 第五栏代表文件大小
- 第六栏代表最近修改时间
- 最后一栏则是 目录、文件名称

### 文件权限的重要性

Linux文件中有比较多属性，其实主要是为了数据安全上的考虑

#### 系统保护
由于Linux的所有内容均以文件的形式存在，如一些系统配置 /etc/shadow/ 这个记录着所有账号的数据， 如果没有控制好文件权限，那么将会出现窃取信息等安全问题

#### 团队开发与共享数据
我们知道文件、目录可以以用户组的方式来设置权限，在团队协同过程中，就可以利用该功能，来更好地设置团队内的资料共享，也可以灵活的将不同团队的权限独立开

#### 如果不正确设置权限
我们现在知道`rwx` 的含义，如果没有设置正确，那么一般账号可能就拥有很大权限，资料可能会被删除、修改。或者本来应该有权限的用户被“拒之门外”
<br>

### 修改文件属性和权限 

既然文件和权限那么重要，了解清楚其含义与设置方式，就至关重要了，我们先来了解下最常见的修改属性的命令：

```shell
chgrp：修改文件所属组
chown：修改文件所属者   
chmod：修改文件属性
```

#### 修改用户组
使用 `chgrp`、`chown` 都比较简单，我们只要稍微查看一下命令手册即可，一般我们采用 `chgrp -h` 可查看到该命令的使用方式。

```shell
[root@localhost home]# chgrp --h
用法：chgrp [选项]... 用户组 文件...
　或：chgrp [选项]... --reference=参考文件 文件...
Change the group of each FILE to GROUP.
```

如我们需要修改一个文件的所属组，只要如下操作：
```shell
# 修改前
-rwxrwx---.  1 root    vboxsf  1350 11月 26 2018 testPrint.jar

# 修改用户组
[root@localhost home] chgrp root testPrint.jar

# 修改后
-rwxrwx---.  1 root    root    1350 11月 26 2018 testPrint.jar
```
注意： 修改组时赋予的目标组，需要存在于 /etc/group 中。

#### 修改文件所属者

```shell
# 修改前
-rwxrwx---.  1 root    root    1350 11月 26 2018 testPrint.jar

# 修改文件所属者

[root@localhost home] chown stephen testPrint.jar

# 修改后
-rwxrwx---.  1 stephen root    1350 11月 26 2018 testPrint.jar
```
同理，修改的目标用户，需要存在与 /etc/passwd 中。

`chmod` 还可以直接顺便修改用户组，如：
```shell
[root@localhost home] chown stephen:stephen testPrint.jar
[root@localhost home] ll
总用量 8
drwxr-xr-x.  4 root    root     123 11月 30 2018 software
drwx------. 14 stephen stephen 4096 11月 26 2018 stephen
-rwxrwx---.  1 stephen stephen 1350 11月 26 2018 testPrint.jar
```
这样就可以把文件 testPrint.jar 修改成 stephen用户和组所属了。

#### 修改权限

修改权限我们可以使用 `chmod` 命令来操作，可分别使用数字类型或者符号来修改。

- 数字类型修改权限

从前面 文件权限 章节，我们可以知道 Linux 的基本权限有9个，为所属者(owner)、用户组(group)、其他人(other)，分别对应各自的 r (读)、w (写)、x (执行)。

权限信息如果为 [-rwxrwxrwx]，实际可以分解成：
```shell
r: 4
w: 3
x: 1
```
每种身份（所属者、用户组、其他人）都分别由自己的权限，权限计算需要进行**累加**，如权限[-rwxrwx---]，则代表：
```shell
owner = 4 + 3 + 1 = 7
group = 4 + 3 + 1 = 7
other = 0 + 0 + 0 = 0
```

那么我们设置权限时，就可以按照这种规则设置，如：
```shell
[root@localhost home] chmod 770 testPrint.jar
[root@localhost home] ll
总用量 8
drwxr-xr-x.  4 root    root     123 11月 30 2018 software
drwx------. 14 stephen stephen 4096 11月 26 2018 stephen
-rwxrwx---.  1 stephen stephen 1350 11月 26 2018 testPrint.jar
```

- 符号类型修改权限

权限设置的目标主要分为 user(用户)、group(用户组)、other(其他人), 以简写可归类为 u、g、o，其中可使用 a 代表所有身份 ，权限仍然使用 r、w、x，这样我们可以通过组合符号（字母）来进行权限设置。

![20240104061446](https://cdn.jsdelivr.net/gh/GitHub-Stephen/blogPic/springboot/20240104061446.png)

我们可以实践一下，如果要把一个文件授权为`--wxrw---`，实际就是:
```shell
(u)所属者拥有：wx
(g)用户组拥有：rx
```

按照符号类型来进行授权的话：
```shell
# 授权前
-rwxrwx---.  1 stephen stephen 1350 11月 26 2018 testPrint.jar

# 修改权限：chmod
[root@localhost home] chmod u=wx,g=rw testPrint.jar

# 授权后
--wxrw----.  1 stephen stephen 1350 11月 26 2018 testPrint.jar
```

`符号类型`的授权方式，可以无需关注原文件权限的情况下，直接设置想要的权限，而且符号形式相对较好记忆，相对`数字类型`设置来说较为方便。

### 文件与目录的权限意义

前面也有介绍权限设置对于文件的重要性，那么这里我们其实需要深入了解下，权限对于文件、目录分别代表什么具体的含义。我们知道现在权限总体分为 `rwx`

**对于文件**
```text
r(read) : 读取文件内容，如读取文本文件内的文字等；
w(write) : 编辑、新增或修改文件内容（不含删除该文件）；
x(eXecute) ：该文件可被系统执行。
```
对于文件的权限，主要是针对文件内容进行控制，并不具备删除文件的权限。

**对于目录**
```text
r(read) : 读取目录下的文件列表内容，常常我们以 ls 命令来列出文件；
w(write) : 
    - 新增新的文件与目录
    - 删除已存在的文件与目录（无论被删除的文件、目录的权限是什么）
    - 对文件、目录进行改名
    - 移动目录内文件的位置；
x(eXecute) ：用户可将该目录作为工作目录，也就是用户登录后的默认目录。
```

对于目录的权限，主要是针对目录内的文件、目录进行控制。

目录的 `x（eXecute)` 权限比较特殊，它并不是控制目录可否被执行，而是控制着用户是否能进入该目录，如下：
```shell
drwxr-xr--.  2 root    root       6 1月   4 06:46 dirPem
```
假设有一个 Stephen 账号，它并不在 root 用户组，则无法进入到 dirPem 这个目录。



## 目录配置

我们可能听说过 CentoOs、Ubuntu、Debian 等 Linux 的发行版，不管哪个版本，它们的配置文件、执行文件、每个目录的内容，其实都很接近，其实这是依据一套标准来设计的。

### Linux目录依据---FHS
> Filesystem Hierarchy Standard

FHS 开始的目的是希望用户知道已安装的软件是存放在哪个目录中，同时希望个人开发者、操作系统制作者等能遵循 FHS。这样一来，就可以在原来 Linux 的基础上，开发出更多独特风格的内容。

FHS 一直在不断优化，对于`文件系统使用的频繁与是否允许用户修改`，将目录分成四种形态：


|           |    可分享        |    不可分享        |
|-----------|------------|------------|
|不可变     |  /usr（软件存放处）     |   /etc（配置文件）         |
|           |  /opt（第三方辅助软件）     |   /boot（启动与内核文件）         |
| 可变动    |  /var/mail (用户邮箱) |  /var/run (程序相关)    |
|           | /var/spool/news (新闻组)   | /var/lock (程序相关) |


上面是一些代表性目录， 它们分别代表：

- 可分享： 可以分享给其他系统挂载使用的目录，包括执行文件与用户的邮件等数据，是能否分享给网络其他的主机进行共享的；
- 不可分享： 自己机器上的运行的设备文件或者与程序有关的 socket 文件等，由于跟滋生系统有关，当然就无法共享出去了；
- 不变：有些数据不会经常变动，跟随着发行版一起往下推进。如函数库、文件说明、主机服务配置等；
- 可变动：经常修改的数据，例如日志文件、用户可自行接收的新闻组等。

在`FHS`下，实际是定义了三层目录下应该放置什么数据：

- / (root,根目录)： 与系统启动有关;
- /usr (unix software resource)：与软件安装/执行有关;
- /var (variable)：与系统运行过程有关;


#### 根目录的意义与内容

&emsp;&emsp;根目录是整个系统最重要的目录，因为其他目录实际上就是根目录所衍生出来的，同时根目录有与系统的启动、还原、系统修复等操作有关。由于系统启动时，需要包含特定的启动软件、内核文件等，若系统出现错误时，根目录则必须包含这类修复程序。 如果根目录设置在一个很大的分区，我们可能就会往里头塞很多数据，这样将会徒增系统出错的风险。

&emsp;&emsp;FHS建议：**根目录所在的分区越小越好，且应用程序所安装的软件最好不要和根目录放在同一个分区内。这样不但性能较佳，根目录所在的文件系统，也不容易发生问题.**

关于根目录的介绍内容比较多，有需要深入了解的话，可以访问 [The Root Filesystem](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch03.html) 查阅。












