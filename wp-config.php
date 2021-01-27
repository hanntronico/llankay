<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'bdllankay' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '*274053*' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '(f$q.EGp,$P|,pO6hz|PHiF,%U;~w49C$!OSxQ7K`p7ZdpU~L1#5UqWVheA9#==o' );
define( 'SECURE_AUTH_KEY',  '<Q3+|vH(:ycd#:#oh_QaTi(Qi]I{Um}e+3! SlPLZZ1Ak{~_E]J/^e0qDTo{les<' );
define( 'LOGGED_IN_KEY',    ';[=RQy>GvI!9M_kA7iLF`/6zVgIWHb31RVQN#3a;UKF}`nj$.B|Lls>Uc_T231|D' );
define( 'NONCE_KEY',        'h,g%@-Eo9(3H~9BwAe9vrDa]pE~G]rHYOe2t%e4D p}{:R~?:I<ackjUMYKOP/4>' );
define( 'AUTH_SALT',        'GeT<,lPsC_|/,5+.=T<@U%dd3Tk4]jfd,TNYg.jT_/$n3T@~3h2P}G.Wqx7/b*P4' );
define( 'SECURE_AUTH_SALT', ')_JI_abSzjwF=G)UT7#1%#k1=s.=]~gdD:j~k_klS5cbLrMH&gR$|PgQG +hoC>C' );
define( 'LOGGED_IN_SALT',   'VeIYU)IAILYY0~`cL<cm0Z1kN#vnZIIBs44&]F+Wr9 f$FHk(6L(9o8T`ylx#mZC' );
define( 'NONCE_SALT',       'O1f?h ]Nvy}V B`ZLdpXQbdLIWR1|HCknzBRBN^@6_t:d%Qu]k*~d0;OlyGFi7OQ' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
