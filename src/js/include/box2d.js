define(['lib/box2dWeb'], function() {
  var includeBox2d = function() {
    return {
      /*jshint camelcase: false */
      b2Vec2: Box2D.Common.Math.b2Vec2,
      b2BodyDef: Box2D.Dynamics.b2BodyDef,
      b2Body: Box2D.Dynamics.b2Body,
      b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
      b2FilterData: Box2D.Dynamics.b2FilterData,
      b2World: Box2D.Dynamics.b2World,
      b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
      b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
      b2Listener: Box2D.Dynamics.b2ContactListener,
      b2Mat22: Box2D.Common.Math.b2Mat22,
      b2Transform: Box2D.Common.Math.b2Transform,
      b2DynamicBody: Box2D.Dynamics.b2Body.b2_dynamicBody,
      b2KinematicBody: Box2D.Dynamics.b2Body.b2_kinematicBody,
      b2StaticBody: Box2D.Dynamics.b2Body.b2_staticBody,
      debugEShapeBit: Box2D.Dynamics.b2DebugDraw.e_shapeBit,
      debugEJointBit: Box2D.Dynamics.b2DebugDraw.e_jointBit,
      /*jshint camelcase: true */
      SCALE: 30.0
    };
  };
  return includeBox2d();
});
