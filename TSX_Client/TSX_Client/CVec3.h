// From http://www.3dkingdoms.com/weekly/vec3.h
#ifndef CVec3_h
#define CVec3_h

#include <math.h>

class CVec3
{
public:
	// Data
	float x, y, z;

	// Ctors
	CVec3( float InX, float InY, float InZ ) : x( InX ), y( InY ), z( InZ )
	{
	}
	CVec3( ) : x(0), y(0), z(0)
	{
	}

	// Operator Overloads
	inline bool operator== (const CVec3& V2) const 
	{
		return (x == V2.x && y == V2.y && z == V2.z);
	}

	inline CVec3 operator+ (const CVec3& V2) const 
	{
		return CVec3( x + V2.x,  y + V2.y,  z + V2.z);
	}
	inline CVec3 operator- (const CVec3& V2) const
	{
		return CVec3( x - V2.x,  y - V2.y,  z - V2.z);
	}
	inline CVec3 operator- ( ) const
	{
		return CVec3(-x, -y, -z);
	}

	inline CVec3 operator/ (float S ) const
	{
		float fInv = 1.0f / S;
		return CVec3 (x * fInv , y * fInv, z * fInv);
	}
	inline CVec3 operator/ (const CVec3& V2) const
	{
		return CVec3 (x / V2.x,  y / V2.y,  z / V2.z);
	}
	inline CVec3 operator* (const CVec3& V2) const
	{
		return CVec3 (x * V2.x,  y * V2.y,  z * V2.z);
	}
	inline CVec3 operator* (float S) const
	{
		return CVec3 (x * S,  y * S,  z * S);
	}

	inline void operator+= ( const CVec3& V2 )
	{
		x += V2.x;
		y += V2.y;
		z += V2.z;
	}
	inline void operator-= ( const CVec3& V2 )
	{
		x -= V2.x;
		y -= V2.y;
		z -= V2.z;
	}

	inline float operator[] ( int i )
	{
		if ( i == 0 ) return x;
		else if ( i == 1 ) return y;
		else return z;
	}

	// Functions
	inline float Dot( const CVec3 &V1 ) const
	{
		return V1.x*x + V1.y*y + V1.z*z;
	}

	inline CVec3 CrossProduct( const CVec3 &V2 ) const
	{
		return CVec3(
			y * V2.z  -  z * V2.y,
			z * V2.x  -  x * V2.z,
			x * V2.y  -  y * V2.x 	);
	}

	// Return vector rotated by the 3x3 portion of matrix m
	// (provided because it's used by bbox.cpp in article 21)
	CVec3 RotByMatrix( const float m[16] ) const
	{
		return CVec3( 
			x*m[0] + y*m[4] + z*m[8],
			x*m[1] + y*m[5] + z*m[9],
			x*m[2] + y*m[6] + z*m[10] );
	}

	// These require math.h for the sqrtf function
	float Magnitude( ) const
	{
		return sqrtf( x*x + y*y + z*z );
	}

	float Distance( const CVec3 &V1 ) const
	{
		return ( *this - V1 ).Magnitude();	
	}

	inline void Normalize()
	{
		float fMag = ( x*x + y*y + z*z );
		if (fMag == 0) {return;}

		float fMult = 1.0f/sqrtf(fMag);            
		x *= fMult;
		y *= fMult;
		z *= fMult;
		return;
	}
};
#endif